import { healthBodyText } from "./health.template";

export interface TemplateReturn {
  body: string;
  title: string;
}

export type TemplateFunction<T = any> = (data: T) => TemplateReturn;

export type TemplateKey = "HEALTH" | "INSCRIPCIONES";

export const templates: Record<string, TemplateFunction> = {
  HEALTH: healthBodyText,
};
