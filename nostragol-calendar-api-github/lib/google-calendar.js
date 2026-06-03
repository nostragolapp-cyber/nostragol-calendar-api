const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

function resolveProjectPath(filePath) {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  return path.resolve(process.cwd(), filePath);
}

function getCalendarConfig() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  const timeZone = process.env.GOOGLE_CALENDAR_TIME_ZONE || "America/Santiago";

  if (!calendarId) {
    throw new Error("Falta GOOGLE_CALENDAR_ID en .env.");
  }

  if (!keyFile && !keyJson && !keyBase64) {
    throw new Error(
      "Falta GOOGLE_SERVICE_ACCOUNT_KEY_FILE, GOOGLE_SERVICE_ACCOUNT_JSON o GOOGLE_SERVICE_ACCOUNT_KEY_BASE64."
    );
  }

  return {
    calendarId,
    credentials: parseCredentials({ keyJson, keyBase64 }),
    keyFile: keyFile ? resolveProjectPath(keyFile) : null,
    timeZone,
  };
}

function parseCredentials({ keyJson, keyBase64 }) {
  if (keyBase64) {
    return JSON.parse(Buffer.from(keyBase64, "base64").toString("utf8"));
  }

  if (keyJson) {
    return JSON.parse(keyJson);
  }

  return null;
}

function buildReminders(reminderMinutes) {
  if (!reminderMinutes) {
    return {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 60 },
        { method: "popup", minutes: 10 },
      ],
    };
  }

  const values = Array.isArray(reminderMinutes)
    ? reminderMinutes
    : String(reminderMinutes).split(",");

  const overrides = values
    .map((value) => Number.parseInt(String(value).trim(), 10))
    .filter((minutes) => Number.isFinite(minutes) && minutes >= 0)
    .map((minutes) => ({ method: "popup", minutes }));

  if (overrides.length === 0) {
    throw new Error("Los recordatorios deben ser numeros en minutos.");
  }

  return { useDefault: false, overrides };
}

function requireEventValue(event, key) {
  if (!event[key]) {
    throw new Error(`Falta ${key}.`);
  }

  return event[key];
}

function normalizeDateTime(value) {
  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) {
    return `${text}:00`;
  }

  return text;
}

function buildCalendarEvent(event, fallbackTimeZone) {
  const timeZone = event.timeZone || fallbackTimeZone || "America/Santiago";
  const requestBody = {
    summary: requireEventValue(event, "title"),
    description: event.description || "",
    location: event.location || "",
    reminders: buildReminders(event.reminderMinutes),
  };

  if (event.allDay) {
    requestBody.start = { date: requireEventValue(event, "start") };
    requestBody.end = { date: requireEventValue(event, "end") };
    return requestBody;
  }

  requestBody.start = {
    dateTime: normalizeDateTime(requireEventValue(event, "start")),
    timeZone,
  };
  requestBody.end = {
    dateTime: normalizeDateTime(requireEventValue(event, "end")),
    timeZone,
  };

  return requestBody;
}

async function createCalendarEvent(event) {
  const config = getCalendarConfig();

  if (!config.credentials && !fs.existsSync(config.keyFile)) {
    throw new Error(`No existe la llave JSON: ${config.keyFile}`);
  }

  const auth = new google.auth.GoogleAuth({
    ...(config.credentials ? { credentials: config.credentials } : { keyFile: config.keyFile }),
    scopes: SCOPES,
  });
  const calendar = google.calendar({ version: "v3", auth });
  const requestBody = buildCalendarEvent(event, config.timeZone);
  const response = await calendar.events.insert({
    calendarId: config.calendarId,
    requestBody,
  });

  return {
    id: response.data.id,
    htmlLink: response.data.htmlLink,
    summary: response.data.summary,
    start: response.data.start,
    end: response.data.end,
  };
}

module.exports = {
  buildCalendarEvent,
  createCalendarEvent,
  getCalendarConfig,
};
