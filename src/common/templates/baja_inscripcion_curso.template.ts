import dotenv from "dotenv";
import { TemplateReturn } from ".";
import { CursoDTO } from "../dto/curso/curso.dto";
import { ToInscripcionDTO } from "../dto/inscripciones/inscriopciones.dto";
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
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};color:${fg};font-weight:700;font-size:12px;">
      ${text}
    </span>
  `;
}

export function bajaInscripcionBodyText({
  inscripcion,
  curso,
  user,
}: TemplateInput): TemplateReturn {
  const fullName = `${user.nombre} ${user.apellido}`;
  const materiaNombre = curso?.materia?.nombre ?? "Curso";
  const carreraNombre = curso.carrera ? curso.carrera.name : " ";

  const fechaBaja = formatDateEsAR(inscripcion.fecha_baja);
  const desde = formatDateEsAR(curso.desde);
  const hasta = formatDateEsAR(curso.hasta);

  const title = `📕 Baja confirmada | ${materiaNombre}`;

  const razonBlock = inscripcion.razon
    ? `
      <div style="margin-top:14px;padding:12px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
        <p style="margin:0;color:#9a3412;font-size:13px;line-height:1.45;">
          <strong>Motivo informado:</strong> ${inscripcion.razon}
        </p>
      </div>
    `
    : "";

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
      <div>
        <h2 style="margin:0;color:#111827;">Baja de inscripción confirmada</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          Hola <strong>${fullName}</strong> (Legajo: <strong>${user.legajo}</strong>),
          registramos correctamente la baja de tu inscripción.
        </p>
      </div>
      <div>
        ${pill("Inscripción dada de baja", "#FEF2F2", "#991B1B")}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <h3 style="margin:0 0 10px 0;color:#111827;font-size:16px;">
        ${materiaNombre}
      </h3>
      <p style="margin:0 0 12px 0;color:#6b7280;font-size:13px;">
        Carrera: <strong style="color:#111827;">${carreraNombre}</strong>
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📅 Día</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${curso.dia}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🌙 Turno</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${curso.turno}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🏫 Sede</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${curso.sede}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🚪 Aula</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${curso.aula}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">⏳ Período</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${desde} a ${hasta}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🗓️ Fecha de baja</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${fechaBaja}
          </td>
        </tr>
      </table>

      ${razonBlock}
    </div>

    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
        Si esta baja no fue solicitada por vos o necesitás volver a inscribirte,
        comunicate con el área académica.
      </p>
    </div>

    <p style="margin:16px 0 0 0;color:#9ca3af;font-size:12px;">
      Este es un mensaje automático. Por favor, no respondas a este correo.
    </p>

  </div>
</div>
`,
  };
}
