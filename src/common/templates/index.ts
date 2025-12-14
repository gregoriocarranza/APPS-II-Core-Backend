import { eventosAcademicosBodyText } from "./eventos_academicos_suscribe.template";
import { eventosAcademicosUnsubscribedBodyText } from "./eventos_academicos_unsuscribe.template";
import { healthBodyText } from "./health.template";
import { transferBodyText } from "./transfer.template";

export interface TemplateReturn {
  body: string;
  title: string;
}

export type TemplateFunction<T = any> = (data: T) => TemplateReturn;

export type TemplateKey =
  | "HEALTH"
  | "INSCRIPCIONES"
  | "EVENTOS_ACADEMICOS_ALTA"
  | "EVENTOS_ACADEMICOS_BAJA"
  | "TRANSFER_NOTIFICATION";

export enum enumTemplateKey {
  HEALTH = "HEALTH",
  INSCRIPCIONES = "INSCRIPCIONES",
  EVENTOS_ACADEMICOS_ALTA = "EVENTOS_ACADEMICOS_ALTA",
  EVENTOS_ACADEMICOS_BAJA = "EVENTOS_ACADEMICOS_BAJA",
  TRANSFER_NOTIFICATION = "TRANSFER_NOTIFICATION",
}

export const templates: Record<string, TemplateFunction> = {
  HEALTH: healthBodyText,
  EVENTOS_ACADEMICOS_ALTA: eventosAcademicosBodyText,
  EVENTOS_ACADEMICOS_BAJA: eventosAcademicosUnsubscribedBodyText,
  TRANSFER_NOTIFICATION: transferBodyText,
};
