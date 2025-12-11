import { EXCHANGES } from "../common/config/rabbitMq/config";
import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";

export async function emitCarreraCreated(carrera: ICarrera): Promise<void> {
  const event = buildDomainEvent("carrera.created", carrera);
  await publishDomainEvent(EXCHANGES.CARRERA, "carrera.created", event);
}

export async function emitCarreraUpdated(carrera: ICarrera): Promise<void> {
  const event = buildDomainEvent("carrera.updated", carrera);
  await publishDomainEvent(EXCHANGES.CARRERA, "carrera.updated", event);
}

export async function emitCarreraDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent("carrera.deleted", { uuid });
  await publishDomainEvent(EXCHANGES.CARRERA, "carrera.deleted", event);
}
