import { TemplateReturn } from ".";
import { IUser } from "../../database/interfaces/user/user.interfaces";

export type ReservationCreatedPayload = {
  reservationId: number;
  userId: string;
  locationId: string;
  mealTime: "DESAYUNO" | "ALMUERZO" | "MERIENDA" | "CENA" | string;
  reservationTimeSlot: string;
  reservationDate: string;
  status: "ACTIVA" | "CONFIRMADA" | "CANCELADA" | string;
  cost: number;
  createdAt: string;
  slotStartTime: string;
  slotEndTime: string;
};

export type TemplateInput = {
  payload: ReservationCreatedPayload;
  user: IUser;
};

function formatDateEsARFromDMYHMS(dmy?: string | null) {
  if (!dmy) return "—";
  const m = dmy.match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return dmy;
  const [, dd, mm, yyyy, HH, MM, SS] = m;
  const isoLike = `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}`;
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return dmy;
  return date.toLocaleString("es-AR");
}

function pill(text: string, bg: string, fg: string) {
  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};color:${fg};font-weight:700;font-size:12px;">
      ${text}
    </span>
  `;
}

function moneyARS(amount?: number | null) {
  if (amount === null || amount === undefined) return "—";
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  });
}

function statusPill(status?: string) {
  const s = (status || "—").toUpperCase();
  if (s === "ACTIVA") return pill("Reserva Activa", "#ECFDF3", "#065F46");
  if (s === "CONFIRMADA")
    return pill("Reserva Confirmada", "#ECFDF3", "#0bb484ff");
  if (s === "CANCELADA") return pill("Reserva Cancelada", "#FEF2F2", "#991B1B");
  return pill(`Estado: ${s}`, "#EFF6FF", "#1D4ED8");
}

function mainTitleByStatus(status?: string) {
  const s = (status || "").toUpperCase();
  if (s === "ACTIVA") return "Reserva Creada";
  if (s === "CONFIRMADA") return "Reserva Confirmada";
  if (s === "CANCELADA") return "Reserva Cancelada";
  return "Reserva UNKNOW";
}

function subjectByStatus(payload: ReservationCreatedPayload) {
  const s = (payload.status || "").toUpperCase();
  if (s === "ACTIVA") return `🍽️ Reserva Activa | ${payload.mealTime}`;
  if (s === "CONFIRMADA") return `✅ Reserva Confirmada | ${payload.mealTime}`;
  if (s === "CANCELADA") return `❌ Reserva cancelada | ${payload.mealTime}`;
  return `🍽️ Reserva creada | ${payload.mealTime}`;
}

export function reservationBodyText({
  payload,
  user,
}: TemplateInput): TemplateReturn {
  const fullName = `${user.nombre} ${user.apellido}`;

  const fechaReserva = formatDateEsARFromDMYHMS(payload.reservationDate);
  const fechaCreacion = formatDateEsARFromDMYHMS(payload.createdAt);

  const title = subjectByStatus(payload);
  const heading = mainTitleByStatus(payload.status);

  const timeRange =
    payload.slotStartTime && payload.slotEndTime
      ? `${payload.slotStartTime} a ${payload.slotEndTime}`
      : "—";

  const helperText =
    (payload.status || "").toUpperCase() === "CANCELADA"
      ? "Tu reserva fue cancelada. Si no fuiste vos, comunicate con soporte."
      : "Si no reconocés esta reserva, comunicate con soporte o con el área correspondiente.";

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
      <div>
        <h2 style="margin:0;color:#111827;">${heading}</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          Hola <strong>${fullName}</strong> (Legajo: <strong>${user.legajo}</strong>),
          te compartimos el detalle de tu reserva del comedor.
        </p>
      </div>
      <div>
        ${statusPill(payload.status)}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <h3 style="margin:0 0 10px 0;color:#111827;font-size:16px;">
        ${payload.mealTime}
      </h3>
      <p style="margin:0 0 12px 0;color:#6b7280;font-size:13px;">
        Ubicación (ID): <strong style="color:#111827;">${payload.locationId}</strong>
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧾 ID de reserva</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            #${payload.reservationId}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🗓️ Fecha de la reserva</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${fechaReserva}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">⏰ Horario</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${timeRange}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">💳 Costo</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${moneyARS(payload.cost)}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🗓️ Creada</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${fechaCreacion}
          </td>
        </tr>
      </table>
    </div>

    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
        ${helperText}
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
