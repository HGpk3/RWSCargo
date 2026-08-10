import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 3000);
const APP_ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(APP_ROOT, "config.json");
const DEFAULT_CONFIG = {
  adminUser: "admin",
  adminPassword: "change-me",
  publicSiteUrl: "https://rwscargo.ru",
  dataFile: path.join(APP_ROOT, "data", "leads.json"),
  telegramBotToken: "",
  telegramChatId: "",
};

async function readConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

const config = await readConfig();
let writeQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(path.dirname(config.dataFile), { recursive: true });

  try {
    await fs.access(config.dataFile);
  } catch {
    await fs.writeFile(config.dataFile, "[]\n", "utf8");
  }
}

async function readLeads() {
  await ensureDataFile();
  const raw = await fs.readFile(config.dataFile, "utf8");

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLeads(leads) {
  await ensureDataFile();
  const tmp = `${config.dataFile}.${process.pid}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
  await fs.rename(tmp, config.dataFile);
}

async function updateLeads(mutator) {
  const nextWrite = writeQueue.catch(() => {}).then(async () => {
    const leads = await readLeads();
    const result = await mutator(leads);
    await writeLeads(leads);
    return result;
  });

  writeQueue = nextWrite.catch(() => {});
  return nextWrite;
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
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

function normalizedPathname(req) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname.replace(/^\/api(?=\/|$)/, "");

  return pathname || "/";
}

function hasAdminAccess(req) {
  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) return false;

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separator = decoded.indexOf(":");

  if (separator < 0) return false;

  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  return user === config.adminUser && password === config.adminPassword;
}

function normalizeLead(input) {
  const consents = input.consents || {};
  const lead = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "new",
    source: String(input.source || "site").trim() || "site",
    name: String(input.name || "").trim(),
    phone: String(input.phone || "").trim(),
    email: String(input.email || "").trim(),
    telegram: String(input.telegram || "").trim(),
    whatsapp: String(input.whatsapp || "").trim(),
    preferred_contact: String(input.preferredContact || "").trim(),
    import_format: String(input.importFormat || "").trim(),
    tasks: Array.isArray(input.tasks) ? input.tasks.map((item) => String(item).trim()).filter(Boolean) : [],
    payload: {
      supplierLink: String(input.supplierLink || "").trim(),
      cargo: String(input.cargo || "").trim(),
      weight: String(input.weight || "").trim(),
      volume: String(input.volume || "").trim(),
      city: String(input.city || "").trim(),
      comment: String(input.comment || "").trim(),
      calculator: input.calculator && typeof input.calculator === "object" ? input.calculator : null,
    },
    notification_status: {},
  };

  const hasContact = Boolean(lead.phone || lead.email || lead.telegram || lead.whatsapp);

  if (!hasContact) {
    return { ok: false, error: "Укажите хотя бы один способ связи." };
  }

  if (!consents.personalData || !consents.contact || !consents.legalCargo) {
    return { ok: false, error: "Подтвердите обязательные согласия." };
  }

  return { ok: true, lead };
}

function leadText(lead) {
  const payload = lead.payload || {};
  const lines = [
    "Новая заявка RWSCargo",
    `ID: ${lead.id}`,
    `Имя: ${lead.name || "не указано"}`,
    `Телефон: ${lead.phone || "не указан"}`,
    `Email: ${lead.email || "не указан"}`,
    `Telegram: ${lead.telegram || "не указан"}`,
    `WhatsApp: ${lead.whatsapp || "не указан"}`,
    `Удобный канал: ${lead.preferred_contact || "не выбран"}`,
    `Формат: ${lead.import_format || "не выбран"}`,
    `Задачи: ${lead.tasks.length ? lead.tasks.join(", ") : "не выбраны"}`,
    `Груз: ${payload.cargo || "не указан"}`,
    `Поставщик: ${payload.supplierLink || "не указан"}`,
    `Вес: ${payload.weight || "не указан"}`,
    `Объём: ${payload.volume || "не указан"}`,
    `Город: ${payload.city || "не указан"}`,
    `Комментарий: ${payload.comment || "не указан"}`,
  ];

  if (payload.calculator) {
    lines.push(`Ориентир калькулятора: ${payload.calculator.estimate || "не указан"}`);
  }

  return lines.join("\n");
}

async function notifyTelegram(lead) {
  if (!config.telegramBotToken || !config.telegramChatId) {
    return { skipped: true, reason: "Telegram is not configured" };
  }

  const siteUrl = String(config.publicSiteUrl || "").replace(/\/$/, "");
  const keyboard = siteUrl
    ? {
        inline_keyboard: [[{ text: "Открыть CRM", url: `${siteUrl}/admin/leads/#${lead.id}` }]],
      }
    : undefined;

  const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: config.telegramChatId,
      text: leadText(lead),
      disable_web_page_preview: true,
      reply_markup: keyboard,
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, body: await response.text() };
  }

  return { ok: true };
}

async function createLead(req, res) {
  const input = await readJson(req);
  const normalized = normalizeLead(input);

  if (!normalized.ok) {
    sendJson(res, 422, { ok: false, error: normalized.error });
    return;
  }

  const lead = normalized.lead;

  lead.payload.userAgent = req.headers["user-agent"] || "";
  lead.payload.referer = req.headers.referer || "";

  try {
    lead.notification_status.telegram = await notifyTelegram(lead);
  } catch (error) {
    lead.notification_status.telegram = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  await updateLeads((leads) => {
    leads.unshift(lead);
  });

  sendJson(res, 201, { ok: true, id: lead.id, notificationStatus: lead.notification_status });
}

async function listLeads(req, res) {
  if (!hasAdminAccess(req)) {
    res.writeHead(401, {
      "www-authenticate": 'Basic realm="RWSCargo CRM"',
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
    return;
  }

  const leads = await readLeads();
  sendJson(res, 200, { ok: true, leads: leads.slice(0, 300) });
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

  const lead = await updateLeads((leads) => {
    const item = leads.find((leadItem) => leadItem.id === id);

    if (!item) return null;

    item.status = status;
    item.updated_at = new Date().toISOString();
    return item;
  });

  if (!lead) {
    sendJson(res, 404, { ok: false, error: "Lead not found" });
    return;
  }

  sendJson(res, 200, { ok: true, lead: { id: lead.id, status: lead.status, updated_at: lead.updated_at } });
}

function route(req, res) {
  const pathname = normalizedPathname(req);

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
      if (req.method === "GET" && (pathname === "/" || pathname === "/health")) {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (req.method === "POST" && pathname === "/leads") {
        await createLead(req, res);
        return;
      }

      if (req.method === "GET" && pathname === "/leads") {
        await listLeads(req, res);
        return;
      }

      const match = pathname.match(/^\/leads\/([0-9a-f-]{36})$/i);

      if (req.method === "PATCH" && match) {
        await updateLead(req, res, match[1]);
        return;
      }

      sendJson(res, 404, { ok: false, error: "Not found", pathname });
    })
    .catch((error) => {
      const status = Number(error?.status || 500);
      console.error(error);
      sendJson(res, status, { ok: false, error: status === 500 ? "Server error" : error.message });
    });
}

await ensureDataFile();

http.createServer(route).listen(PORT, () => {
  console.log(`RWSCargo Beget API listening on ${PORT}`);
});
