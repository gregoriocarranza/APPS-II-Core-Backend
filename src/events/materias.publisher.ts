import { IMateria } from "../database/interfaces/materia/materia.interfaces";
import { ICorrelativa } from "../database/interfaces/materia/correlativa.interface";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";
import { EXCHANGES } from "../common/config/rabbitMq/config";

export async function emitMateriaCreated(materia: IMateria): Promise<void> {
  const event = buildDomainEvent("materia.created", materia);
  await publishDomainEvent(EXCHANGES.MATERIA, "materia.created", event);
}

export async function emitMateriaUpdated(materia: IMateria): Promise<void> {
  const event = buildDomainEvent("materia.updated", materia);
  await publishDomainEvent(EXCHANGES.MATERIA, "materia.updated", event);
}

export async function emitMateriaDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent("materia.deleted", {
    uuid,
  });
  await publishDomainEvent(EXCHANGES.MATERIA, "materia.deleted", event);
}

export async function emitCorrelativaCreated(
  correlativa: ICorrelativa
): Promise<void> {
  const event = buildDomainEvent("correlativa.created", correlativa);
  await publishDomainEvent(EXCHANGES.MATERIA, "correlativa.created", event);
}

export async function emitCorrelativaDeleted(
  uuidMateria: string,
  uuidMateriaCorrelativa: string
): Promise<void> {
  const event = buildDomainEvent("correlativa.deleted", {
    uuid_materia: uuidMateria,
    uuid_materia_correlativa: uuidMateriaCorrelativa,
  });
  await publishDomainEvent(EXCHANGES.MATERIA, "correlativa.deleted", event);
}
