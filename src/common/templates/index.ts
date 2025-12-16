import { bajaInscripcionBodyText } from "./baja_inscripcion_curso.template";
import { cierreActaBodyText } from "./cierre_de_acta_template";
import { eventosAcademicosBodyText } from "./eventos_academicos_suscribe.template";
import { eventosAcademicosUnsubscribedBodyText } from "./eventos_academicos_unsuscribe.template";
import { cargaDeNotaBodyText } from "./grade_notification";
import { healthBodyText } from "./health.template";
import { inscripcionCursoBodyText } from "./inscripcion_curso.template";
import { sancionBibliotecaBodyText } from "./sancion_biblioteca.template";
import { transferBodyText } from "./transfer.template";

export interface TemplateReturn {
  body: string;
  title: string;
}

export type TemplateFunction<T = any> = (data: T) => TemplateReturn;

export type TemplateKey =
  | "HEALTH"
  | "INSCRIPCIONES"
  | "INSCRIPCIONES_BAJA"
  | "EVENTOS_ACADEMICOS_ALTA"
  | "EVENTOS_ACADEMICOS_BAJA"
  | "TRANSFER_NOTIFICATION"
  | "CARGA_DE_NOTAS"
  | "CIERRE_DE_ACTA"
  | "SANCION_BIBLIOTECA";

export enum enumTemplateKey {
  HEALTH = "HEALTH",
  INSCRIPCIONES = "INSCRIPCIONES",
  INSCRIPCIONES_BAJA = "INSCRIPCIONES_BAJA",
  EVENTOS_ACADEMICOS_ALTA = "EVENTOS_ACADEMICOS_ALTA",
  EVENTOS_ACADEMICOS_BAJA = "EVENTOS_ACADEMICOS_BAJA",
  TRANSFER_NOTIFICATION = "TRANSFER_NOTIFICATION",
  CIERRE_DE_ACTA = "CIERRE_DE_ACTA",
  CARGA_DE_NOTAS = "CARGA_DE_NOTAS",
  SANCION_BIBLIOTECA = "SANCION_BIBLIOTECA",
}

export const templates: Record<string, TemplateFunction> = {
  HEALTH: healthBodyText,
  INSCRIPCIONES: inscripcionCursoBodyText,
  INSCRIPCIONES_BAJA: bajaInscripcionBodyText,
  EVENTOS_ACADEMICOS_ALTA: eventosAcademicosBodyText,
  EVENTOS_ACADEMICOS_BAJA: eventosAcademicosUnsubscribedBodyText,
  TRANSFER_NOTIFICATION: transferBodyText,
  CIERRE_DE_ACTA: cierreActaBodyText,
  CARGA_DE_NOTAS: cargaDeNotaBodyText,
  SANCION_BIBLIOTECA: sancionBibliotecaBodyText,
};
