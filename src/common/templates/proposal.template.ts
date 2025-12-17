import dotenv from "dotenv";
import { TemplateReturn } from ".";
dotenv.config();

export interface IMateria {
  uuid: string;
  nombre: string;
  uuid_carrera: string;
  description?: string | null;
  approval_method: "final" | "promocion" | "trabajo_practico";
  is_elective: boolean;
  metadata?: Record<string, any> | null;
  created_at: Date | string;
  updated_at: Date | string;
}

type ProposalBase = {
  proposalId: string;
  teacherId: string;
  subjectId: string;
};

type ProposalCreatedPayload = ProposalBase;

type ProposalStatusChangedPayload = ProposalBase & {
  previousState: string;
  newState: string;
  decidedAt?: string;
};

export type ProposalPayload =
  | ProposalCreatedPayload
  | ProposalStatusChangedPayload;

type TemplateInput = {
  payload: ProposalPayload;
  user: {
    uuid: string;
    nombre: string;
    apellido: string;
    email: string;
    legajo: string;
  };
  subject: IMateria;
};

function formatDateEsAR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR");
}

function safe(s?: string | null) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function chip(text: string, bg: string, fg: string) {
  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};color:${fg};font-weight:700;font-size:12px;">
      ${text}
    </span>
  `;
}

function statusChip(state?: string | null) {
  const s = (state ?? "").toUpperCase();
  const map: Record<string, { bg: string; fg: string; text: string }> = {
    APROBADA: { bg: "#ECFDF5", fg: "#065F46", text: "Aprobada" },
    RECHAZADA: { bg: "#FEF2F2", fg: "#991B1B", text: "Rechazada" },
    PENDIENTE: { bg: "#FFFBEB", fg: "#92400E", text: "Pendiente" },
  };
  const cfg = map[s] || {
    bg: "#EEF2FF",
    fg: "#3730A3",
    text: `Estado: ${safe(s)}`,
  };
  return chip(cfg.text, cfg.bg, cfg.fg);
}

function approvalMethodLabel(m: IMateria["approval_method"]) {
  const map: Record<IMateria["approval_method"], string> = {
    final: "Final",
    promocion: "Promoción",
    trabajo_practico: "Trabajo práctico",
  };
  return map[m] ?? m;
}

function isStatusChangedPayload(p: any): p is ProposalStatusChangedPayload {
  return (
    !!p && typeof p === "object" && "newState" in p && "previousState" in p
  );
}

export function proposalUnifiedBodyText(data: TemplateInput): TemplateReturn {
  const p = data.payload;
  const subject = data.subject;

  const fullName = `${data.user.nombre} ${data.user.apellido}`;

  const isChanged = isStatusChangedPayload(p);
  const newState = isChanged ? p.newState : "PENDIENTE";

  const headerTitle = isChanged
    ? "Actualización de propuesta"
    : "Propuesta recibida";
  const subtitle = isChanged
    ? "Hubo una decisión sobre tu propuesta."
    : "Registramos tu propuesta y quedará en revisión.";

  const title = isChanged
    ? `📌 Propuesta ${p.proposalId} | ${p.newState}`
    : `📨 Propuesta recibida | ${p.proposalId}`;

  const rightChip = isChanged
    ? statusChip(p.newState)
    : chip("En revisión", "#EEF2FF", "#3730A3");

  const decidedRow =
    isChanged && p.decidedAt
      ? `
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧠 Decisión</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${formatDateEsAR(p.decidedAt)}</td>
        </tr>
      `
      : "";

  const stateRows = isChanged
    ? `
      <tr style="border-top:1px solid #e5e7eb;">
        <td style="padding:12px 0;color:#374151;font-size:14px;">🔁 Estado anterior</td>
        <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safe(p.previousState)}</td>
      </tr>
      <tr style="border-top:1px solid #e5e7eb;">
        <td style="padding:12px 0;color:#374151;font-size:14px;">✅ Estado nuevo</td>
        <td style="padding:12px 0;text-align:right;color:#111827;font-weight:800;">${safe(p.newState)}</td>
      </tr>
    `
    : "";

  const electiveChip = subject.is_elective
    ? chip("Electiva", "#F0F9FF", "#075985")
    : chip("Obligatoria", "#F3F4F6", "#374151");

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px;box-shadow:0 2px 14px rgba(0,0,0,0.06);">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <div>
        <h2 style="margin:0;color:#111827;">${headerTitle}</h2>
        <p style="margin:8px 0 0 0;color:#6b7280;font-size:14px;">
          Hola <strong>${safe(fullName)}</strong> (Legajo: <strong>${safe(data.user.legajo)}</strong>), ${safe(subtitle)}
        </p>
      </div>
      <div style="flex:0 0 auto;text-align:right;">
        ${rightChip}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:14px;padding:18px;background:#ffffff;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div>
          <h3 style="margin:0;color:#111827;font-size:18px;">
            ${safe(subject.nombre)}
          </h3>
          <p style="margin:6px 0 0 0;color:#6b7280;font-size:13px;">
            Propuesta: <span style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${safe(p.proposalId)}</span>
          </p>
        </div>
        <div style="flex:0 0 auto; display:flex; gap:8px; align-items:center;">
          ${electiveChip}
          ${chip(`Aprobación: ${safe(approvalMethodLabel(subject.approval_method))}`, "#EEF2FF", "#3730A3")}
        </div>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:10px;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📚 Materia</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safe(subject.uuid)}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">👩‍🏫 Docente</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${data.user.nombre}</td>
        </tr>

        ${stateRows}
        ${decidedRow}
      </table>

      ${
        subject.description
          ? `<p style="margin:14px 0 0 0;color:#374151;font-size:14px;line-height:1.55;">
              ${safe(subject.description)}
            </p>`
          : ""
      }

      <div style="margin-top:14px;padding:12px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
        <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
          ${
            isChanged
              ? `Estado actual: <strong>${safe(newState)}</strong>.`
              : `Estado actual: <strong>PENDIENTE</strong>. Te avisaremos cuando haya novedades.`
          }
        </p>
      </div>
    </div>

    <p style="margin:16px 0 0 0;color:#9ca3af;font-size:12px;line-height:1.45;">
      Si recibiste este mail por error, ignoralo. Este mensaje es informativo.
    </p>

  </div>
</div>
`,
  };
}
