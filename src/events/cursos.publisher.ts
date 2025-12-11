import { EXCHANGES } from "../common/config/rabbitMq/config";
import { ICurso } from "../database/interfaces/cursos/cursos.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";

export async function emitCursoCreated(curso: ICurso): Promise<void> {
  const event = buildDomainEvent("curso.created", curso);
  await publishDomainEvent(EXCHANGES.CURSO, "curso.created", event);
}

export async function emitCursoUpdated(curso: ICurso): Promise<void> {
  const event = buildDomainEvent("curso.updated", curso);
  await publishDomainEvent(EXCHANGES.CURSO, "curso.updated", event);
}

export async function emitCursoDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent("curso.deleted", { uuid });
  await publishDomainEvent(EXCHANGES.CURSO, "curso.deleted", event);
}
