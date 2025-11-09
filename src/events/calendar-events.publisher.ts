import { ICalendarEvent } from "../database/interfaces/calendar-event/calendar-event.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../lib/rabbitmq";

const EVENT_VERSION = 1;
const CALENDAR_EVENTS_EXCHANGE =
  process.env.CALENDAR_EVENTS_EXCHANGE?.trim() ||
  process.env.EVENTOS_CALENDARIO_EXCHANGE?.trim() ||
  "eventos-calendario.event";

export async function emitCalendarEventCreated(
  calendarEvent: ICalendarEvent,
): Promise<void> {
  const event = buildDomainEvent("evento-calendario.created", calendarEvent, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(
    CALENDAR_EVENTS_EXCHANGE,
    "evento-calendario.created",
    event,
  );
}

export async function emitCalendarEventUpdated(
  calendarEvent: ICalendarEvent,
): Promise<void> {
  const event = buildDomainEvent("evento-calendario.updated", calendarEvent, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(
    CALENDAR_EVENTS_EXCHANGE,
    "evento-calendario.updated",
    event,
  );
}

export async function emitCalendarEventDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent(
    "evento-calendario.deleted",
    { uuid },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(
    CALENDAR_EVENTS_EXCHANGE,
    "evento-calendario.deleted",
    event,
  );
}
