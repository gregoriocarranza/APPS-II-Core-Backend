import { IMateria } from "../database/interfaces/materia/materia.interfaces";
import { ICorrelativa } from "../database/interfaces/materia/correlativa.interface";
import { buildDomainEvent, publishDomainEvent } from "../lib/rabbitmq";

const EVENT_VERSION = 1;
const MATERIAS_EXCHANGE =
  process.env.MATERIAS_EXCHANGE?.trim() || "materias.event";

export async function emitMateriaCreated(materia: IMateria): Promise<void> {
  const event = buildDomainEvent("materia.created", materia, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(MATERIAS_EXCHANGE, "materia.created", event);
}

export async function emitMateriaUpdated(materia: IMateria): Promise<void> {
  const event = buildDomainEvent("materia.updated", materia, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(MATERIAS_EXCHANGE, "materia.updated", event);
}

export async function emitMateriaDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent(
    "materia.deleted",
    {
      uuid,
    },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(MATERIAS_EXCHANGE, "materia.deleted", event);
}

export async function emitCorrelativaCreated(
  correlativa: ICorrelativa,
): Promise<void> {
  const event = buildDomainEvent("correlativa.created", correlativa, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(
    MATERIAS_EXCHANGE,
    "correlativa.created",
    event,
  );
}

export async function emitCorrelativaDeleted(
  uuidMateria: string,
  uuidMateriaCorrelativa: string,
): Promise<void> {
  const event = buildDomainEvent(
    "correlativa.deleted",
    {
      uuid_materia: uuidMateria,
      uuid_materia_correlativa: uuidMateriaCorrelativa,
    },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(
    MATERIAS_EXCHANGE,
    "correlativa.deleted",
    event,
  );
}
