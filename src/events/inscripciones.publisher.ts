import { ToInscripcionDTO } from "../common/dto/inscripciones/inscriopciones.dto";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";

const EVENT_VERSION = 1;
const INSCRIPCIONES_EXCHANGE =
  process.env.INSCRIPCIONES_EXCHANGE?.trim() || "inscripciones.event";

export async function emitInscripcionCreated(
  inscripcion: ToInscripcionDTO,
): Promise<void> {
  const event = buildDomainEvent("inscripcion.created", inscripcion, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(
    INSCRIPCIONES_EXCHANGE,
    "inscripcion.created",
    event,
  );
}

export async function emitInscripcionUpdated(
  inscripcion: ToInscripcionDTO,
): Promise<void> {
  const event = buildDomainEvent("inscripcion.updated", inscripcion, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(
    INSCRIPCIONES_EXCHANGE,
    "inscripcion.updated",
    event,
  );
}

export async function emitInscripcionDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent(
    "inscripcion.deleted",
    { uuid },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(
    INSCRIPCIONES_EXCHANGE,
    "inscripcion.deleted",
    event,
  );
}
