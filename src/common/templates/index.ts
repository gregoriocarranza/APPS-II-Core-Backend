import { eventosAcademicosBodyText } from "./eventos_academicos.template";
import { healthBodyText } from "./health.template";

export interface TemplateReturn {
  body: string;
  title: string;
}

export type TemplateFunction<T = any> = (data: T) => TemplateReturn;

export type TemplateKey = "HEALTH" | "INSCRIPCIONES" | "EVENTOS_ACADEMICOS";

export enum enumTemplateKey {
  HEALTH = "HEALTH",
  INSCRIPCIONES = "INSCRIPCIONES",
  EVENTOS_ACADEMICOS = "EVENTOS_ACADEMICOS",
}

export const templates: Record<string, TemplateFunction> = {
  HEALTH: healthBodyText,
  EVENTOS_ACADEMICOS: eventosAcademicosBodyText,
};
