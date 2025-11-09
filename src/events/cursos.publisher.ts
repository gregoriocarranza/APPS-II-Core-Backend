import { ICurso } from "../database/interfaces/cursos/cursos.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../lib/rabbitmq";

const EVENT_VERSION = 1;
const CURSOS_EXCHANGE =
  process.env.CURSOS_EXCHANGE?.trim() || "cursos.event";

export async function emitCursoCreated(curso: ICurso): Promise<void> {
  const event = buildDomainEvent("curso.created", curso, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(CURSOS_EXCHANGE, "curso.created", event);
}

export async function emitCursoUpdated(curso: ICurso): Promise<void> {
  const event = buildDomainEvent("curso.updated", curso, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(CURSOS_EXCHANGE, "curso.updated", event);
}

export async function emitCursoDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent(
    "curso.deleted",
    { uuid },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(CURSOS_EXCHANGE, "curso.deleted", event);
}
