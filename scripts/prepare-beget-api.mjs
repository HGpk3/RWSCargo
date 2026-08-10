import fs from "node:fs/promises";
import path from "node:path";

const DIST_API_DIR = path.resolve("dist", "api");
const sitePath = process.env.BEGET_PATH?.replace(/\/+$/, "");

if (!sitePath) {
  throw new Error("BEGET_PATH is required to prepare the Beget API bundle.");
}

function defaultNodePath() {
  const user = process.env.BEGET_USER?.trim();

  if (!user) return "node";

  return `/home/${user[0]}/${user}/.local/bin/node`;
}

const nodePath = process.env.BEGET_NODE_PATH?.trim() || defaultNodePath();
const dataDir = path.posix.join(path.posix.dirname(sitePath), "rwscargo-crm-data");
const adminPassword = process.env.CRM_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!adminPassword) {
  throw new Error("CRM_ADMIN_PASSWORD is required to deploy the Beget CRM API safely.");
}

const config = {
  adminUser: process.env.CRM_ADMIN_USER || process.env.ADMIN_USER || "admin",
  adminPassword,
  publicSiteUrl: process.env.PUBLIC_SITE_URL || "https://rwscargo.ru",
  dataFile: path.posix.join(dataDir, "leads.json"),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
};

const htaccess = [
  `PassengerNodejs ${nodePath}`,
  `PassengerAppRoot ${sitePath}/api`,
  "PassengerAppType node",
  "PassengerStartupFile server.js",
  "",
].join("\n");

await fs.rm(DIST_API_DIR, { recursive: true, force: true });
await fs.mkdir(path.join(DIST_API_DIR, "tmp"), { recursive: true });
await fs.copyFile(path.resolve("server", "beget-api.cjs"), path.join(DIST_API_DIR, "server.js"));
await fs.writeFile(path.join(DIST_API_DIR, ".htaccess"), htaccess, "utf8");
await fs.writeFile(path.join(DIST_API_DIR, "config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8");
await fs.writeFile(path.join(DIST_API_DIR, "tmp", "restart.txt"), `${new Date().toISOString()}\n`, "utf8");

console.log(`Prepared Beget API bundle in ${path.relative(process.cwd(), DIST_API_DIR)}`);
console.log(`Passenger Node binary: ${nodePath}`);
console.log(`CRM data file: ${config.dataFile}`);
