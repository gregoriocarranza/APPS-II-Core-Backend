import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";

const EVENT_VERSION = 1;
const CARRERAS_EXCHANGE =
  process.env.CARRERAS_EXCHANGE?.trim() || "carreras.event";

export async function emitCarreraCreated(carrera: ICarrera): Promise<void> {
  const event = buildDomainEvent("carrera.created", carrera, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(CARRERAS_EXCHANGE, "carrera.created", event);
}

export async function emitCarreraUpdated(carrera: ICarrera): Promise<void> {
  const event = buildDomainEvent("carrera.updated", carrera, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(CARRERAS_EXCHANGE, "carrera.updated", event);
}

export async function emitCarreraDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent(
    "carrera.deleted",
    { uuid },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(CARRERAS_EXCHANGE, "carrera.deleted", event);
}
