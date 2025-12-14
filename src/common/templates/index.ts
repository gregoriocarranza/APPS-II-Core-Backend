import { eventosAcademicosBodyText } from "./eventos_academicos_suscribe.template";
import { eventosAcademicosUnsubscribedBodyText } from "./eventos_academicos_unsuscribe.template";
import { healthBodyText } from "./health.template";

export interface TemplateReturn {
  body: string;
  title: string;
}

export type TemplateFunction<T = any> = (data: T) => TemplateReturn;

export type TemplateKey =
  | "HEALTH"
  | "INSCRIPCIONES"
  | "EVENTOS_ACADEMICOS_ALTA"
  | "EVENTOS_ACADEMICOS_BAJA";

export enum enumTemplateKey {
  HEALTH = "HEALTH",
  INSCRIPCIONES = "INSCRIPCIONES",
  EVENTOS_ACADEMICOS_ALTA = "EVENTOS_ACADEMICOS_ALTA",
  EVENTOS_ACADEMICOS_BAJA = "EVENTOS_ACADEMICOS_BAJA",
}

export const templates: Record<string, TemplateFunction> = {
  HEALTH: healthBodyText,
  EVENTOS_ACADEMICOS_ALTA: eventosAcademicosBodyText,
  EVENTOS_ACADEMICOS_BAJA: eventosAcademicosUnsubscribedBodyText,
};
