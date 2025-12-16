import dotenv from "dotenv";
import { TemplateReturn } from ".";
import { ToInscripcionDTO } from "../dto/inscripciones/inscriopciones.dto";
import { CursoDTO } from "../dto/curso/curso.dto";
import { IUser } from "../../database/interfaces/user/user.interfaces";
dotenv.config();

type TemplateInput = {
  inscripcion: ToInscripcionDTO;
  curso: CursoDTO;
  user: IUser;
};

function formatDateEsAR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR");
}

function pill(text: string, bg: string, fg: string) {
  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};color:${fg};font-weight:700;font-size:12px;white-space:nowrap;">
      ${text}
    </span>
  `;
}

function enrollmentBadge(estado?: string | null) {
  const s = String(estado ?? "")
    .trim()
    .toUpperCase();

  // Ajustá si tus estados son otros (ej: "aprobada", "pendiente", etc.)
  const map: Record<string, { bg: string; fg: string; text: string }> = {
    APPROVED: { bg: "#ECFDF5", fg: "#065F46", text: "Inscripción aprobada" },
    ACCEPTED: { bg: "#ECFDF5", fg: "#065F46", text: "Inscripción confirmada" },
    CONFIRMED: { bg: "#ECFDF5", fg: "#065F46", text: "Inscripción confirmada" },
    PENDING: { bg: "#FFFBEB", fg: "#92400E", text: "Inscripción pendiente" },
    REJECTED: { bg: "#FEF2F2", fg: "#991B1B", text: "Inscripción rechazada" },
    CANCELED: { bg: "#F3F4F6", fg: "#374151", text: "Inscripción cancelada" },
  };

  const cfg = map[s] || {
    bg: "#EEF2FF",
    fg: "#3730A3",
    text: estado ? `Estado: ${estado}` : "Estado: —",
  };
  return pill(cfg.text, cfg.bg, cfg.fg);
}

function courseModeBadge(modalidad?: string | null) {
  const m = String(modalidad ?? "")
    .trim()
    .toUpperCase();
  const map: Record<string, { bg: string; fg: string; text: string }> = {
    PRESENCIAL: { bg: "#EEF2FF", fg: "#3730A3", text: "Presencial" },
    VIRTUAL: { bg: "#ECFEFF", fg: "#155E75", text: "Virtual" },
    HIBRIDA: { bg: "#F5F3FF", fg: "#5B21B6", text: "Híbrida" },
  };

  const cfg = map[m] || {
    bg: "#F3F4F6",
    fg: "#374151",
    text: modalidad ? String(modalidad) : "—",
  };
  return pill(`Modalidad: ${cfg.text}`, cfg.bg, cfg.fg);
}

function safeText(v: any, fallback = "—") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

export function inscripcionCursoBodyText(data: TemplateInput): TemplateReturn {
  const { inscripcion, curso, user } = data;

  const fullName = `${user.nombre} ${user.apellido}`;
  const materiaNombre = curso?.materia?.nombre ?? "Materia";
  const carreraNombre = curso.carrera ? curso.carrera.name : " ";

  // Título del mail (subject)
  const title = `📚 ${materiaNombre} | Estado de inscripción: ${safeText(inscripcion.estado)}`;

  const desde = formatDateEsAR(curso.desde);
  const hasta = formatDateEsAR(curso.hasta);

  const statusWarning =
    user.status !== "activo"
      ? `
      <div style="margin-top:14px;padding:12px;border-radius:12px;background:#FEF2F2;border:1px solid #FECACA;">
        <p style="margin:0;color:#991B1B;font-size:13px;line-height:1.45;">
          <strong>Atención:</strong> tu cuenta figura como <strong>${user.status}</strong>. Si esto es un error, contactá a soporte.
        </p>
      </div>
    `
      : "";

  const cursoEstadoNote = String(curso.estado ?? "").trim().length
    ? `
      <div style="margin-top:14px;padding:12px;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb;">
        <p style="margin:0;color:#374151;font-size:13px;">
          <strong>Estado del curso:</strong> ${safeText(curso.estado)}
        </p>
      </div>
    `
    : "";

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <div style="min-width:260px;">
        <h2 style="margin:0;color:#111827;">Inscripción a curso</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;line-height:1.45;">
          Hola <strong>${fullName}</strong> (Legajo: <strong>${user.legajo}</strong>),
          registramos una actualización de tu inscripción.
        </p>
      </div>

      <div style="display:flex;gap:8px;align-items:center;flex:0 0 auto;">
        ${enrollmentBadge(inscripcion.estado)}
      </div>
    </div>

    <div style="margin-top:16px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#ffffff;">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
        <div style="min-width:260px;">
          <h3 style="margin:0 0 6px 0;color:#111827;font-size:16px;">${safeText(materiaNombre, "Curso")}</h3>
          <p style="margin:0;color:#6b7280;font-size:13px;">
            Carrera: <strong style="color:#111827;">${safeText(carreraNombre)}</strong>
          </p>
        </div>
        <div style="flex:0 0 auto;">
          ${courseModeBadge(curso.modalidad)}
        </div>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:12px;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧾 ID inscripción</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(inscripcion.uuid)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🏷️ Rol</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(inscripcion.rol)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📌 Estado inscripción</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(inscripcion.estado)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🏫 Sede</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(curso.sede)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🚪 Aula</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(curso.aula)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🗓️ Día</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(curso.dia)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🌙 Turno</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(curso.turno)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧩 Comisión</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(curso.comision)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📖 Período</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safeText(curso.periodo)}</td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">⏳ Vigencia</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${desde} a ${hasta}</td>
        </tr>

      </table>

      ${cursoEstadoNote}
      ${statusWarning}
    </div>

    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
        <strong>Tip:</strong> guardá este mail para tener a mano los datos del curso (sede, aula, turno) y el estado de tu inscripción.
      </p>
      <p style="margin:10px 0 0 0;color:#6b7280;font-size:12px;line-height:1.45;">
        Contacto registrado: <strong>${safeText(user.email)}</strong> • Tel: <strong>${safeText(user.telefono_personal)}</strong>
      </p>
    </div>

    <p style="margin:16px 0 0 0;color:#9ca3af;font-size:12px;line-height:1.45;">
      Este es un mensaje automático. Si detectás inconsistencias, comunicate con soporte.
    </p>
  </div>
</div>
`,
  };
}
