const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ quiet: true });

function resolveProjectPath(filePath) {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  return path.resolve(process.cwd(), filePath);
}

const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;

if (!keyFile) {
  throw new Error("Falta GOOGLE_SERVICE_ACCOUNT_KEY_FILE en .env.");
}

const resolvedKeyFile = resolveProjectPath(keyFile);

if (!fs.existsSync(resolvedKeyFile)) {
  throw new Error(`No existe la llave JSON: ${resolvedKeyFile}`);
}

const serviceAccountBase64 = fs.readFileSync(resolvedKeyFile).toString("base64");
const adminApiKey = crypto.randomBytes(32).toString("hex");
const outputPath = path.resolve(process.cwd(), ".render-env.local.txt");
const lines = [
  "GOOGLE_CALENDAR_ID=nostragolapp@gmail.com",
  "GOOGLE_CALENDAR_TIME_ZONE=America/Santiago",
  `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=${serviceAccountBase64}`,
  `NOSTRAGOL_ADMIN_API_KEY=${adminApiKey}`,
  "NOSTRAGOL_ALLOWED_ORIGINS=https://REEMPLAZA-TU-BACKEND.onrender.com,capacitor://localhost,http://localhost",
  "",
  "Despues del deploy, reemplaza REEMPLAZA-TU-BACKEND por la URL real de Render.",
  "Guarda NOSTRAGOL_ADMIN_API_KEY: sera la clave que pegues en la app para agendar.",
];

fs.writeFileSync(outputPath, lines.join("\n"), { encoding: "utf8" });

console.log(`Archivo creado: ${outputPath}`);
