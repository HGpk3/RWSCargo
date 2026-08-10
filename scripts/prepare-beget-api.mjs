import fs from "node:fs/promises";
import path from "node:path";

const DIST_API_DIR = path.resolve("dist", "api");
const sitePath = process.env.BEGET_PATH?.replace(/\/+$/, "");

if (!sitePath) {
  throw new Error("BEGET_PATH is required to prepare the Beget API bundle.");
}

const dataDir = path.posix.join(path.posix.dirname(sitePath), "rwscargo-crm-data");
const adminPassword = process.env.CRM_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!adminPassword) {
  throw new Error("CRM_ADMIN_PASSWORD is required to deploy the Beget CRM API safely.");
}

const config = {
  admin_user: process.env.CRM_ADMIN_USER || process.env.ADMIN_USER || "admin",
  admin_password: adminPassword,
  public_site_url: process.env.PUBLIC_SITE_URL || "https://rwscargo.ru",
  data_file: path.posix.join(dataDir, "leads.json"),
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || "",
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || "",
};

const htaccess = [
  "Options -Indexes",
  "RewriteEngine On",
  "RewriteCond %{REQUEST_FILENAME} !-f",
  "RewriteRule ^ index.php [QSA,L]",
  "",
].join("\n");

function phpValue(value) {
  if (Array.isArray(value)) {
    return `array(${value.map(phpValue).join(", ")})`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([key, entryValue]) => `${phpValue(key)} => ${phpValue(entryValue)}`);
    return `array(${entries.join(", ")})`;
  }

  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (value === null || value === undefined) return "null";

  return `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
}

await fs.rm(DIST_API_DIR, { recursive: true, force: true });
await fs.mkdir(DIST_API_DIR, { recursive: true });
await fs.copyFile(path.resolve("server", "beget-api-php", "index.php"), path.join(DIST_API_DIR, "index.php"));
await fs.writeFile(path.join(DIST_API_DIR, ".htaccess"), htaccess, "utf8");
await fs.writeFile(path.join(DIST_API_DIR, "config.php"), `<?php\n\nreturn ${phpValue(config)};\n`, "utf8");

console.log(`Prepared Beget API bundle in ${path.relative(process.cwd(), DIST_API_DIR)}`);
console.log("API runtime: PHP");
console.log(`CRM data file: ${config.data_file}`);
