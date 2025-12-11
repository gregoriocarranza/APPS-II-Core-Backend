import { EXCHANGES } from "../common/config/rabbitMq/config";
import { ToInscripcionDTO } from "../common/dto/inscripciones/inscriopciones.dto";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";


export async function emitInscripcionCreated(
  inscripcion: ToInscripcionDTO
): Promise<void> {
  const event = buildDomainEvent("enrollment.created", inscripcion);
  await publishDomainEvent(EXCHANGES.ENROLLMENT, "enrollment.created", event);
}

export async function emitInscripcionUpdated(
  inscripcion: ToInscripcionDTO
): Promise<void> {
  const event = buildDomainEvent("enrollment.updated", inscripcion);
  await publishDomainEvent(EXCHANGES.ENROLLMENT, "enrollment.updated", event);
}

export async function emitInscripcionDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent("enrollment.deleted", { uuid });
  await publishDomainEvent(EXCHANGES.ENROLLMENT, "enrollment.deleted", event);
}
