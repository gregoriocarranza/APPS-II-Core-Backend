import dotenv from "dotenv";
import { TemplateReturn } from ".";
dotenv.config();

export type GradeCreatedPayload = {
  occurredAt: string;
  courseId: string;
  term: string | null;
  assessmentId: string;
  assessmentType: "PARCIAL_1" | "PARCIAL_2" | "FINAL";
  studentId: string;
  grade: string;
  publishedBy: string;
};

export type TemplateInput = {
  event: {
    payload: GradeCreatedPayload;
  };
  user: {
    uuid: string;
    nombre: string;
    apellido: string;
    email: string;
    legajo?: string;
  };
  context?: {
    courseName?: string | null;
    subjectName?: string | null;
  };
};

function formatDateEsAR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR");
}

function assessmentLabel(t: string) {
  const map: Record<string, string> = {
    PARCIAL_1: "Parcial 1",
    PARCIAL_2: "Parcial 2",
    FINAL: "Final",
  };
  return map[t] ?? t;
}

function gradeBadge(gradeStr: string) {
  const n = Number(gradeStr);
  const isNum = !Number.isNaN(n);

  let cfg = { bg: "#EEF2FF", fg: "#3730A3", text: `Nota: ${gradeStr}` };

  if (isNum) {
    if (n >= 6)
      cfg = { bg: "#ECFDF5", fg: "#065F46", text: `Aprobado: ${gradeStr}` };
    else
      cfg = { bg: "#FEF2F2", fg: "#991B1B", text: `No aprobado: ${gradeStr}` };
  }

  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${cfg.bg};color:${cfg.fg};font-weight:800;font-size:12px;">
      ${cfg.text}
    </span>
  `;
}

export function cargaDeNotaBodyText(data: TemplateInput): TemplateReturn {
  const p = data.event.payload;

  const fullName = data.user
    ? `${data.user.nombre} ${data.user.apellido}`
    : "Hola";
  const occurredAt = formatDateEsAR(p.occurredAt);

  const niceAssessment = assessmentLabel(p.assessmentType);
  const courseLabel =
    data.context?.courseName || data.context?.subjectName
      ? `${data.context?.subjectName ?? ""}${data.context?.subjectName && data.context?.courseName ? " · " : ""}${data.context?.courseName ?? ""}`.trim()
      : `Curso ${p.courseId}`;

  const title = `📝 Nota publicada | ${niceAssessment} - ${gradeBadge(p.grade)}`;

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
      <div>
        <h2 style="margin:0;color:#111827;">Se publicó una nota</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          ${data.user ? `Hola <strong>${fullName}</strong>${data.user.legajo ? ` (Legajo: <strong>${data.user.legajo}</strong>)` : ""},` : "Hola,"}
          ya tenés una nueva calificación cargada en el sistema.
        </p>
      </div>
      <div style="flex:0 0 auto;">
        ${gradeBadge(p.grade)}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#ffffff;">
      <h3 style="margin:0 0 10px 0;color:#111827;font-size:16px;">${courseLabel}</h3>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧪 Evaluación</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:700;">${niceAssessment}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">✅ Nota</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:700;">${p.grade}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📅 Fecha de publicación</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${occurredAt}</td>
        </tr>
      </table>

      <p style="margin:14px 0 0 0;color:#6b7280;font-size:12px;line-height:1.45;">
        Referencias internas: assessmentId <strong>${p.assessmentId}</strong> · courseId <strong>${p.courseId}</strong>
      </p>
    </div>

    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
        Si considerás que hay un error, contactá a tu docente o a la secretaría académica para revisión.
      </p>
    </div>

  </div>
</div>
`,
  };
}
