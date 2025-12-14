import dotenv from "dotenv";
import { TemplateReturn } from ".";
dotenv.config();

type LocationPayload = {
  id: string;
  name: string;
  address: string;
  capacity: number;
};

type EventPayload = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: LocationPayload;
  description?: string | null;
  price?: number | null;
  availableSeats?: number | null;
  paymentStatus?: string | null;
  enrollmentDate?: string | null;
  imageUrl?: string | null;
};

type TemplateInput = {
  event: { payload: { userId: string; event: EventPayload; enrollmentDate?: string; paymentStatus?: string } };
  user: {
    uuid: string;
    nombre: string;
    apellido: string;
    email: string;
    legajo: string;
  };
};

function formatDateEsAR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR");
}

function formatMoneyARS(value?: number | null) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function badge(paymentStatus?: string | null) {
  const status = (paymentStatus || "PENDING").toUpperCase();

  const map: Record<string, { bg: string; fg: string; text: string }> = {
    APPROVED: { bg: "#ECFDF5", fg: "#065F46", text: "Pago aprobado" },
    PENDING: { bg: "#FFFBEB", fg: "#92400E", text: "Pago pendiente" },
    REJECTED: { bg: "#FEF2F2", fg: "#991B1B", text: "Pago rechazado" },
  };

  const cfg = map[status] || { bg: "#EEF2FF", fg: "#3730A3", text: `Estado: ${status}` };

  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${cfg.bg};color:${cfg.fg};font-weight:700;font-size:12px;">
      ${cfg.text}
    </span>
  `;
}

export function eventosAcademicosBodyText(data: TemplateInput): TemplateReturn {
  const serviceName: string = process.env.APP_NAME || "Edu App";

  const payload = data.event.payload;
  const ev = payload.event;

  const fullName = `${data.user.nombre} ${data.user.apellido}`;
  const start = formatDateEsAR(ev.startTime);
  const end = formatDateEsAR(ev.endTime);

  const enrollmentDate = formatDateEsAR(payload.enrollmentDate);
  const paymentStatus = payload.paymentStatus ?? ev.paymentStatus ?? "PENDING";

  const title = `🎓 ${ev.name} | Confirmación de inscripción`;

  const seatsLine =
    ev.availableSeats === 0
      ? `<p style="margin:10px 0 0 0;color:#991B1B;font-size:13px;"><strong>Importante:</strong> el evento está sin cupos disponibles actualmente.</p>`
      : ev.availableSeats !== null && ev.availableSeats !== undefined
        ? `<p style="margin:10px 0 0 0;color:#065F46;font-size:13px;"><strong>Cupos disponibles:</strong> ${ev.availableSeats}</p>`
        : "";

  const imageBlock = ev.imageUrl
    ? `
      <img src="${ev.imageUrl}" alt="Imagen del evento" style="width:100%;max-height:220px;object-fit:cover;border-radius:12px;margin:14px 0 0 0;" />
    `
    : "";

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
      <div>
        <h2 style="margin:0;color:#111827;">🎓 Inscripción a evento académico</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          Hola <strong>${fullName}</strong> (Legajo: <strong>${data.user.legajo}</strong>), registramos tu inscripción.
        </p>
      </div>
      <div style="flex:0 0 auto;">
        ${badge(paymentStatus)}
      </div>
    </div>

    ${imageBlock}

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#ffffff;">
      <h3 style="margin:0 0 10px 0;color:#111827;font-size:16px;">${ev.name}</h3>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📅 Inicio</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${start}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">⏰ Fin</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${end}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📍 Lugar</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${ev.location?.name ?? "—"}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧭 Dirección</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${ev.location?.address ?? "—"}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">👥 Capacidad</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${ev.location?.capacity ?? "—"}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">💳 Precio</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${formatMoneyARS(ev.price ?? null)}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📝 Fecha de inscripción</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${enrollmentDate}</td>
        </tr>
      </table>

      ${
        ev.description
          ? `<p style="margin:14px 0 0 0;color:#374151;font-size:14px;line-height:1.45;">
              ${ev.description}
            </p>`
          : ""
      }

      ${seatsLine}
    </div>

    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;">
        <strong>Tip:</strong> guardá este mail para tener a mano fecha, lugar y estado del pago.
      </p>
    </div>

    <p style="margin-top:16px;color:#9ca3af;font-size:12px;">
      Enviado por <strong>${serviceName}</strong>. Si no esperabas esta notificación, podés ignorarla.
    </p>

  </div>
</div>
`,
  };
}
