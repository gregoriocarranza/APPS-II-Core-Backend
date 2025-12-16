import dotenv from "dotenv";
import { TemplateReturn } from ".";

dotenv.config();

export type ActClosedItem = {
  studentId: string;
  exam1: string | null;
  exam2: string | null;
  exam3: string | null;
  exam4: string | null;
  makeUpTarget: string | null;
  makeUpGrade: string | null;
  courseGrade: string | null;
  finalGrade: string | null;
  subjectGrade: string | null;
  attendancePct: number;
  promotable: boolean;
  requirementsOk: boolean;
  finalStatus: "APROBADA" | "DESAPROBADA" | "AUSENTE";
};

export type ActClosedPayload = {
  actaId: string;
  courseId: string;
  term: string | null;
  closedAt: string;
  closedBy: string;
  items: ActClosedItem[];
};

export type TemplateInput = {
  actaId: string;
  courseId: string;
  term: string | null;
  closedAt: string;
  closedBy: string;
  alumno: ActClosedItem;
};

function formatDateEsAR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR");
}

function grade(value?: string | null) {
  return value ?? "—";
}

function statusBadge(status: ActClosedItem["finalStatus"]) {
  const map = {
    APROBADA: { bg: "#ECFDF5", fg: "#065F46", text: "Acta aprobada" },
    DESAPROBADA: { bg: "#FEF2F2", fg: "#991B1B", text: "Acta desaprobada" },
    AUSENTE: { bg: "#FFFBEB", fg: "#92400E", text: "Alumno ausente" },
  };

  const cfg = map[status];

  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;
      background:${cfg.bg};color:${cfg.fg};
      font-weight:700;font-size:12px;">
      ${cfg.text}
    </span>
  `;
}

export function cierreActaBodyText(data: TemplateInput): TemplateReturn {
  const alumno = data.alumno;

  const title = "📘 Cierre de acta académica";

  const closedAt = formatDateEsAR(data.closedAt);

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
      <div>
        <h2 style="margin:0;color:#111827;">Cierre de acta</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          El acta correspondiente a tu cursada fue cerrada oficialmente.
        </p>
      </div>
      <div>
        ${statusBadge(alumno.finalStatus)}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <h3 style="margin:0 0 12px 0;color:#111827;font-size:16px;">
        Detalle académico
      </h3>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:10px 0;color:#374151;">📅 Fecha de cierre</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">${closedAt}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:10px 0;color:#374151;">📝 Nota cursada</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">${grade(alumno.courseGrade)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:10px 0;color:#374151;">🎓 Nota final</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">${grade(alumno.finalGrade)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:10px 0;color:#374151;">📊 Nota materia</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">${grade(alumno.subjectGrade)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:10px 0;color:#374151;">📈 Asistencia</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">${alumno.attendancePct}%</td>
        </tr>
      </table>
    </div>

    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
        Si detectás algún error en la información, comunicate con la secretaría académica.
      </p>
    </div>

  </div>
</div>
`,
  };
}
