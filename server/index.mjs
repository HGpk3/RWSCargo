import http from "node:http";
import { randomUUID } from "node:crypto";
import process from "node:process";
import { Pool } from "pg";
import nodemailer from "nodemailer";

const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://rwscargo:rwscargo_dev_password@postgres:5432/rwscargo";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function ensureSchema() {
  await pool.query(`
    create table if not exists leads (
      id uuid primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      status text not null default 'new',
      source text not null default 'site',
      name text,
      phone text,
      email text,
      telegram text,
      whatsapp text,
      preferred_contact text,
      import_format text,
      tasks text[] not null default '{}',
      payload jsonb not null default '{}'::jsonb,
      notification_status jsonb not null default '{}'::jsonb
    );
  `);
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
}

async function readJson(req) {
  let raw = "";

  for await (const chunk of req) {
    raw += chunk;

    if (raw.length > 256_000) {
      throw Object.assign(new Error("Payload too large"), { status: 413 });
    }
  }

  if (!raw.trim()) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("Invalid JSON"), { status: 400 });
  }
}

function hasAdminAccess(req) {
  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) return false;

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  return user === ADMIN_USER && password === ADMIN_PASSWORD;
}

function normalizeLead(input) {
  const consents = input.consents || {};
  const lead = {
    name: String(input.name || "").trim(),
    phone: String(input.phone || "").trim(),
    email: String(input.email || "").trim(),
    telegram: String(input.telegram || "").trim(),
    whatsapp: String(input.whatsapp || "").trim(),
    preferredContact: String(input.preferredContact || "").trim(),
    importFormat: String(input.importFormat || "").trim(),
    supplierLink: String(input.supplierLink || "").trim(),
    cargo: String(input.cargo || "").trim(),
    weight: String(input.weight || "").trim(),
    volume: String(input.volume || "").trim(),
    city: String(input.city || "").trim(),
    comment: String(input.comment || "").trim(),
    calculator: input.calculator && typeof input.calculator === "object" ? input.calculator : null,
    tasks: Array.isArray(input.tasks) ? input.tasks.map((item) => String(item).trim()).filter(Boolean) : [],
    consents: {
      personalData: Boolean(consents.personalData),
      contact: Boolean(consents.contact),
      legalCargo: Boolean(consents.legalCargo),
    },
  };

  const hasContact = Boolean(lead.phone || lead.email || lead.telegram || lead.whatsapp);

  if (!hasContact) {
    return { ok: false, error: "Укажите хотя бы один способ связи." };
  }

  if (!lead.consents.personalData || !lead.consents.contact || !lead.consents.legalCargo) {
    return { ok: false, error: "Подтвердите обязательные согласия." };
  }

  return { ok: true, lead };
}

function leadText(lead, id) {
  const lines = [
    `Новая заявка RWSCargo`,
    `ID: ${id}`,
    `Имя: ${lead.name || "не указано"}`,
    `Телефон: ${lead.phone || "не указан"}`,
    `Email: ${lead.email || "не указан"}`,
    `Telegram: ${lead.telegram || "не указан"}`,
    `WhatsApp: ${lead.whatsapp || "не указан"}`,
    `Удобный канал: ${lead.preferredContact || "не выбран"}`,
    `Формат: ${lead.importFormat || "не выбран"}`,
    `Задачи: ${lead.tasks.length ? lead.tasks.join(", ") : "не выбраны"}`,
    `Груз: ${lead.cargo || "не указан"}`,
    `Поставщик: ${lead.supplierLink || "не указан"}`,
    `Вес: ${lead.weight || "не указан"}`,
    `Объём: ${lead.volume || "не указан"}`,
    `Город: ${lead.city || "не указан"}`,
    `Комментарий: ${lead.comment || "не указан"}`,
  ];

  if (lead.calculator) {
    lines.push(`Ориентир калькулятора: ${lead.calculator.estimate || "не указан"}`);
  }

  return lines.join("\n");
}

async function notifyTelegram(text, id) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = (process.env.PUBLIC_SITE_URL || "").replace(/\/$/, "");

  if (!token || !chatId) {
    return { skipped: true, reason: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set" };
  }

  const keyboard = siteUrl
    ? {
        inline_keyboard: [[{ text: "Открыть CRM", url: `${siteUrl}/admin/leads/#${id}` }]],
      }
    : undefined;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      reply_markup: keyboard,
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, body: await response.text() };
  }

  return { ok: true };
}

async function notifyEmail(text, id) {
  const host = process.env.SMTP_HOST;
  const to = process.env.LEAD_EMAIL_TO;

  if (!host || !to) {
    return { skipped: true, reason: "SMTP_HOST or LEAD_EMAIL_TO is not set" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || "",
        }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.LEAD_EMAIL_FROM || process.env.SMTP_USER || "RWSCargo <leads@rwscargo.ru>",
    to,
    subject: `Новая заявка RWSCargo ${id}`,
    text,
  });

  return { ok: true };
}

async function createLead(req, res) {
  const input = await readJson(req);
  const normalized = normalizeLead(input);

  if (!normalized.ok) {
    sendJson(res, 422, { ok: false, error: normalized.error });
    return;
  }

  const id = randomUUID();
  const lead = normalized.lead;
  const source = String(input.source || "site").trim() || "site";
  const payload = {
    ...lead,
    userAgent: req.headers["user-agent"] || "",
    referer: req.headers.referer || "",
  };

  await pool.query(
    `insert into leads (
      id, source, name, phone, email, telegram, whatsapp, preferred_contact,
      import_format, tasks, payload
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      id,
      source,
      lead.name || null,
      lead.phone || null,
      lead.email || null,
      lead.telegram || null,
      lead.whatsapp || null,
      lead.preferredContact || null,
      lead.importFormat || null,
      lead.tasks,
      payload,
    ],
  );

  const text = leadText(lead, id);
  const notificationStatus = {};

  for (const [key, fn] of Object.entries({ telegram: notifyTelegram, email: notifyEmail })) {
    try {
      notificationStatus[key] = await fn(text, id);
    } catch (error) {
      notificationStatus[key] = { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  await pool.query(
    `update leads set notification_status = $2, updated_at = now() where id = $1`,
    [id, notificationStatus],
  );

  sendJson(res, 201, { ok: true, id, notificationStatus });
}

async function listLeads(req, res) {
  if (!hasAdminAccess(req)) {
    res.writeHead(401, {
      "www-authenticate": 'Basic realm="RWSCargo CRM"',
      "content-type": "application/json; charset=utf-8",
    });
    res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
    return;
  }

  const result = await pool.query(`
    select id, created_at, updated_at, status, source, name, phone, email,
      telegram, whatsapp, preferred_contact, import_format, tasks, payload,
      notification_status
    from leads
    order by created_at desc
    limit 300
  `);

  sendJson(res, 200, { ok: true, leads: result.rows });
}

async function updateLead(req, res, id) {
  if (!hasAdminAccess(req)) {
    sendJson(res, 401, { ok: false, error: "Unauthorized" });
    return;
  }

  const input = await readJson(req);
  const allowedStatuses = new Set(["new", "in_progress", "closed"]);
  const status = String(input.status || "").trim();

  if (!allowedStatuses.has(status)) {
    sendJson(res, 422, { ok: false, error: "Unknown status" });
    return;
  }

  const result = await pool.query(
    `update leads set status = $2, updated_at = now() where id = $1 returning id, status, updated_at`,
    [id, status],
  );

  if (!result.rowCount) {
    sendJson(res, 404, { ok: false, error: "Lead not found" });
    return;
  }

  sendJson(res, 200, { ok: true, lead: result.rows[0] });
}

function route(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
    });
    res.end();
    return;
  }

  Promise.resolve()
    .then(async () => {
      if (req.method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/leads") {
        await createLead(req, res);
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/leads") {
        await listLeads(req, res);
        return;
      }

      const match = url.pathname.match(/^\/api\/leads\/([0-9a-f-]{36})$/i);

      if (req.method === "PATCH" && match) {
        await updateLead(req, res, match[1]);
        return;
      }

      sendJson(res, 404, { ok: false, error: "Not found" });
    })
    .catch((error) => {
      const status = Number(error?.status || 500);
      console.error(error);
      sendJson(res, status, { ok: false, error: status === 500 ? "Server error" : error.message });
    });
}

for (let attempt = 1; attempt <= 20; attempt += 1) {
  try {
    await ensureSchema();
    break;
  } catch (error) {
    if (attempt === 20) throw error;

    console.warn(`Database is not ready, retrying schema init (${attempt}/20)`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

http.createServer(route).listen(PORT, () => {
  console.log(`RWSCargo lead API listening on ${PORT}`);
});
