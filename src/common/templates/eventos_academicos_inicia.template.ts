import dotenv from "dotenv";
import { TemplateReturn } from ".";
dotenv.config();

type LocationPayload = {
  id: string;
  name: string;
  address: string;
  capacity: number;
};

export type EventPayload = {
  event: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    location: LocationPayload;
    description?: string | null;
    price?: number | null;
    availableSeats?: number | null;
    registered?: boolean | null;
    imageUrl?: string | null;
  };
  registerdUserIds?: string[];
};

type TemplateInput = {
  payload: EventPayload;
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

function chip(text: string, bg: string, fg: string) {
  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};color:${fg};font-weight:700;font-size:12px;">
      ${text}
    </span>
  `;
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

function timeUntilText(startIso?: string | null) {
  if (!startIso) return "Próximamente";
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return "Próximamente";

  const now = new Date();
  const diffMs = start.getTime() - now.getTime();

  // Ya empezó
  if (diffMs <= 0) {
    const minutesAgo = Math.floor(Math.abs(diffMs) / 60000);
    if (minutesAgo < 5) return "¡Comienza ahora!";
    if (minutesAgo < 60) return `Comenzó hace ${minutesAgo} min`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `Comenzó hace ${hoursAgo} h`;
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
  const minutes = totalMinutes - days * 60 * 24 - hours * 60;

  // Armado “humano”
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} día${days === 1 ? "" : "s"}`);
  if (hours > 0) parts.push(`${hours} h`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} min`);

  // Si es muy cercano, enfatizar
  if (days === 0 && hours === 0 && minutes <= 15)
    return `¡Comienza en ${minutes} min!`;

  return `Comenzará en ${parts.join(" ") || "instantes"}`;
}

export function academicEventUpcomingBodyText(
  data: TemplateInput
): TemplateReturn {
  const payload = data.payload;
  const ev = payload.event;

  const fullName = `${data.user.nombre} ${data.user.apellido}`;
  const start = formatDateEsAR(ev.startTime);
  const end = formatDateEsAR(ev.endTime);

  const isRegistered =
    (Array.isArray(payload.registerdUserIds) &&
      payload.registerdUserIds.includes(data.user.uuid)) ||
    ev.registered === true ||
    true;

  const startsInText = timeUntilText(ev.startTime);

  const title = `⏰ Recordatorio: ${ev.name} | ${startsInText}`;

  const statusChip = isRegistered
    ? chip("Recordatorio de tu evento", "#EEF2FF", "#3730A3")
    : chip("Recordatorio", "#EEF2FF", "#3730A3");

  const urgencyChip = chip(startsInText, "#FFFBEB", "#92400E");

  const imageBlock = ev.imageUrl
    ? `
      <img src="${ev.imageUrl}" alt="Imagen del evento" style="width:100%;max-height:240px;object-fit:cover;border-radius:14px;margin:14px 0 0 0;" />
    `
    : "";

  const reminderBanner = `
    <div style="margin-top:16px;border-radius:14px;padding:14px;background:#111827;color:#ffffff;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div>
          <p style="margin:0;font-size:13px;opacity:0.9;">Tu evento está por comenzar</p>
          <p style="margin:4px 0 0 0;font-size:18px;font-weight:800;">${safe(startsInText)}</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0;font-size:12px;opacity:0.85;">Inicio</p>
          <p style="margin:4px 0 0 0;font-size:14px;font-weight:700;">${start}</p>
        </div>
      </div>
    </div>
  `;

  const calendarHints = `
    <div style="margin-top:14px;padding:14px;border-radius:12px;background:#f9fafb;border:1px dashed #e5e7eb;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
        <strong>Tip:</strong> si vas justo de tiempo, abrí tu calendario y activá un recordatorio.
        <br/>
        <span style="color:#111827;font-weight:600;">Inicio:</span> ${start} &nbsp;|&nbsp;
        <span style="color:#111827;font-weight:600;">Fin:</span> ${end}
      </p>
    </div>
  `;

  const descriptionBlock = ev.description
    ? `<p style="margin:14px 0 0 0;color:#374151;font-size:14px;line-height:1.55;">
        ${safe(ev.description)}
      </p>`
    : "";

  const priceLine =
    ev.price !== null && ev.price !== undefined
      ? `<tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">💳 Precio</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${formatMoneyARS(ev.price)}</td>
        </tr>`
      : "";

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px;box-shadow:0 2px 14px rgba(0,0,0,0.06);">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <div>
        <h2 style="margin:0;color:#111827;">Recordatorio de evento académico</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          Hola <strong>${safe(fullName)}</strong> (Legajo: <strong>${safe(
            data.user.legajo
          )}</strong>), este es un recordatorio porque ya estás inscripto/a.
        </p>
      </div>
      <div style="flex:0 0 auto;text-align:left;">
        ${statusChip}
        <div style="height:8px;"></div>
        ${urgencyChip}
      </div>
    </div>

    ${reminderBanner}

    ${imageBlock}

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:14px;padding:18px;background:#ffffff;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
        <div>
          <h3 style="margin:0;color:#111827;font-size:18px;">${safe(ev.name)}</h3>
          <p style="margin:6px 0 0 0;color:#6b7280;font-size:13px;">
            ID del evento: <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${safe(
              ev.id
            )}</span>
          </p>
        </div>
        <div style="flex:0 0 auto;">
          ${
            ev.availableSeats !== null && ev.availableSeats !== undefined
              ? chip(`Cupos: ${ev.availableSeats}`, "#F3F4F6", "#374151")
              : ""
          }
        </div>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:10px;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">⏳ Comienza</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:800;">${safe(
            startsInText
          )}</td>
        </tr>
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
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safe(
            ev.location?.name ?? "—"
          )}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧭 Dirección</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${safe(
            ev.location?.address ?? "—"
          )}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">👥 Capacidad</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${
            ev.location?.capacity ?? "—"
          }</td>
        </tr>
        ${priceLine}
      </table>

      ${descriptionBlock}
    </div>

    ${calendarHints}

    <p style="margin:16px 0 0 0;color:#9ca3af;font-size:12px;line-height:1.45;">
      Si recibiste este mail por error, ignoralo. Este mensaje es informativo y no requiere respuesta.
    </p>

  </div>
</div>
`,
  };
}
