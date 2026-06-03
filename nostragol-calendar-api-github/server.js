const path = require("path");
const express = require("express");
require("dotenv").config({ quiet: true });

const { createCalendarEvent } = require("./lib/google-calendar");

const app = express();
const port = Number.parseInt(process.env.PORT || "3000", 10);
const allowedOrigins = (process.env.NOSTRAGOL_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json({ limit: "100kb" }));
app.use((request, response, next) => {
  const origin = request.headers.origin;

  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
    }
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Nostragol-Api-Key");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});
app.use(express.static(path.join(__dirname, "dist")));

function requireAdminApiKey(request, response, next) {
  const configuredKey = process.env.NOSTRAGOL_ADMIN_API_KEY;
  const providedKey = request.get("X-Nostragol-Api-Key");

  if (!configuredKey) {
    response.status(500).json({
      ok: false,
      error: "Falta configurar NOSTRAGOL_ADMIN_API_KEY.",
    });
    return;
  }

  if (providedKey !== configuredKey) {
    response.status(401).json({
      ok: false,
      error: "Clave de agenda invalida.",
    });
    return;
  }

  next();
}

app.get("/api/health", (request, response) => {
  response.json({ ok: true });
});

app.post("/api/calendar/events", requireAdminApiKey, async (request, response) => {
  try {
    const createdEvent = await createCalendarEvent(request.body);
    response.status(201).json({ ok: true, event: createdEvent });
  } catch (error) {
    response.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Nostragol API lista en http://localhost:${port}`);
});
