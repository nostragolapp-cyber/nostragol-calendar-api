require("dotenv").config({ quiet: true });
const { buildCalendarEvent, createCalendarEvent, getCalendarConfig } = require("../lib/google-calendar");

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const nextValue = argv[index + 1];
    const value =
      inlineValue !== undefined
        ? inlineValue
        : nextValue && !nextValue.startsWith("--")
          ? argv[++index]
          : "true";

    args[rawKey] = value;
  }

  return args;
}

function buildEvent(args) {
  return {
    title: args.title,
    start: args.start,
    end: args.end,
    description: args.description || "",
    location: args.location || "",
    reminderMinutes: args["reminder-minutes"],
    timeZone: args.timezone,
    allDay: args["all-day"] === "true",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const event = buildEvent(args);
  const { calendarId, timeZone } = getCalendarConfig();
  const requestBody = buildCalendarEvent(event, timeZone);

  if (args["dry-run"] === "true") {
    console.log(JSON.stringify({ calendarId, requestBody }, null, 2));
    return;
  }

  const eventCreated = await createCalendarEvent(event);

  console.log("Evento creado en Google Calendar.");
  console.log(`ID: ${eventCreated.id}`);
  console.log(`Link: ${eventCreated.htmlLink}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
