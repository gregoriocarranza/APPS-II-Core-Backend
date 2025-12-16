import dotenv from "dotenv";
import { TemplateReturn } from ".";
import { IUser } from "../../database/interfaces/user/user.interfaces";

dotenv.config();

type SanctionStatus = "PENDING" | "PAID" | "CANCELED" | "REJECTED" | string;

export type SanctionBasePayload = {
  sanctionId: string;
  userId: string;
  parameterId?: string;
  amount?: string | number;
  status: SanctionStatus;
  createdAt?: string;
  updatedAt?: string;
};

type TemplateInput = {
  payload: SanctionBasePayload;
  user: IUser;
};

function formatDateEsAR(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR");
}

function formatMoneyARS(amount?: string | number | null) {
  if (!amount) return "—";
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function pill(text: string, bg: string, fg: string) {
  return `
    <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};color:${fg};font-weight:700;font-size:12px;white-space:nowrap;">
      ${text}
    </span>
  `;
}

function statusMeta(status: SanctionStatus) {
  const s = (status || "").toUpperCase();
  switch (s) {
    case "PAID":
      return {
        pill: pill("Pagada", "#ECFDF5", "#065F46"),
        headline: "Sanción abonada",
        lead: "Registramos el pago de tu sanción en Biblioteca.",
        toneBoxBg: "#F0FDF4",
        toneBoxBorder: "#BBF7D0",
        toneText: "#166534",
        icon: "✅",
      };
    case "PENDING":
      return {
        pill: pill("Pendiente", "#FFFBEB", "#92400E"),
        headline: "Sanción registrada",
        lead: "Tenés una sanción pendiente de pago en Biblioteca.",
        toneBoxBg: "#FFF7ED",
        toneBoxBorder: "#FED7AA",
        toneText: "#9A3412",
        icon: "⏳",
      };
    case "CANCELED":
      return {
        pill: pill("Cancelada", "#F3F4F6", "#374151"),
        headline: "Sanción cancelada",
        lead: "La sanción fue cancelada y ya no requiere acción.",
        toneBoxBg: "#F9FAFB",
        toneBoxBorder: "#E5E7EB",
        toneText: "#374151",
        icon: "🧾",
      };
    case "REJECTED":
      return {
        pill: pill("Rechazada", "#FEF2F2", "#991B1B"),
        headline: "Sanción rechazada",
        lead: "Hubo un problema con el estado de tu sanción.",
        toneBoxBg: "#FEF2F2",
        toneBoxBorder: "#FECACA",
        toneText: "#991B1B",
        icon: "⚠️",
      };
    default:
      return {
        pill: pill(s || "Estado", "#EEF2FF", "#3730A3"),
        headline: "Actualización de sanción",
        lead: "Se actualizó el estado de tu sanción en Biblioteca.",
        toneBoxBg: "#EEF2FF",
        toneBoxBorder: "#C7D2FE",
        toneText: "#3730A3",
        icon: "ℹ️",
      };
  }
}

export function sancionBibliotecaBodyText({
  payload,
  user,
}: TemplateInput): TemplateReturn {
  const fullName = `${user.nombre} ${user.apellido}`.trim();
  const meta = statusMeta(payload.status);

  const createdAt = formatDateEsAR(payload.createdAt);
  const updatedAt = formatDateEsAR(payload.updatedAt);

  const amount = formatMoneyARS(payload.amount);

  const isCreated = String(payload.status).toUpperCase() === "PENDING";
  const title = isCreated
    ? `${meta.icon} Sanción en Biblioteca | ${payload.status}`
    : `${meta.icon} Estado de sanción actualizado | ${payload.status}`;

  const actionLine =
    String(payload.status).toUpperCase() === "PENDING"
      ? `
        <div style="margin-top:14px;padding:14px;border-radius:12px;background:${meta.toneBoxBg};border:1px solid ${meta.toneBoxBorder};">
          <p style="margin:0;color:${meta.toneText};font-size:13px;line-height:1.45;">
            <strong>Acción sugerida:</strong> regularizá el pago para evitar restricciones en préstamos o reservas.
          </p>
        </div>
      `
      : `
        <div style="margin-top:14px;padding:14px;border-radius:12px;background:#F9FAFB;border:1px solid #E5E7EB;">
          <p style="margin:0;color:#374151;font-size:13px;line-height:1.45;">
            Si ves un estado inesperado, contactá a Biblioteca para validar la situación.
          </p>
        </div>
      `;

  return {
    title,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
      <div>
        <h2 style="margin:0;color:#111827;">${meta.headline}</h2>
        <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
          Hola <strong>${fullName || "—"}</strong> (Legajo: <strong>${user.legajo ?? "—"}</strong>),
          ${meta.lead}
        </p>
      </div>
      <div>
        ${meta.pill}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <h3 style="margin:0 0 10px 0;color:#111827;font-size:16px;">
        Detalles de la sanción
      </h3>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🧾 ID de sanción</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${payload.sanctionId || "—"}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">🏷️ Parámetro</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${payload.parameterId || "—"}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">💰 Monto</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${amount}
          </td>
        </tr>

        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:14px;">📌 Estado</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
            ${String(payload.status || "—").toUpperCase()}
          </td>
        </tr>

        ${
          createdAt
            ? `
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#374151;font-size:14px;">🗓️ Creada</td>
            <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
              ${createdAt}
            </td>
          </tr>
        `
            : ""
        }

        ${
          updatedAt
            ? `
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#374151;font-size:14px;">🔁 Última actualización</td>
            <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
              ${updatedAt}
            </td>
          </tr>
        `
            : ""
        }


      </table>

      ${actionLine}
    </div>

    <p style="margin:16px 0 0 0;color:#9ca3af;font-size:12px;">
      Este es un mensaje automático. Por favor, no respondas a este correo.
    </p>

  </div>
</div>
`,
  };
}
