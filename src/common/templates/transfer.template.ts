import { TemplateReturn } from ".";
import { getServiceEnvironment } from "../utils/environment.resolver";
import { ITransferDTO } from "../dto/transfer/ITransfer.dto";

export type TransferTemplateInput = {
  transfer: ITransferDTO;
  direction: "incoming" | "outgoing";
};

export function transferBodyText(data: TransferTemplateInput): TemplateReturn {
  const environment = getServiceEnvironment();

  const timestamp = new Date(data.transfer.processed_at).toLocaleString(
    "es-AR"
  );

  const isOutgoing = data.direction === "outgoing";

  const title = isOutgoing
    ? "💸 Transferencia enviada"
    : "💰 Transferencia recibida";

  const amountSign = isOutgoing ? "-" : "+";
  const mainMessage = isOutgoing
    ? "Realizaste una transferencia correctamente."
    : "Recibiste una transferencia en tu billetera.";

  return {
    title: `${title}`,
    body: `
<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

    <h2 style="margin:0 0 8px 0;color:#111827;">${title}</h2>

    <p style="margin:0 0 16px 0;color:#374151;font-size:15px;">
      ${mainMessage}
    </p>

    <p style="margin:0 0 24px 0;color:#6b7280;font-size:14px;">
      Fecha y hora: <strong>${timestamp}</strong>
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr style="border-top:1px solid #e5e7eb;">
        <td style="padding:12px 0;color:#374151;">Monto</td>
        <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
          ${amountSign} ${data.transfer.amount.toFixed(2)} ${data.transfer.currency}
        </td>
      </tr>

      <tr style="border-top:1px solid #e5e7eb;">
        <td style="padding:12px 0;color:#374151;">Estado</td>
        <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
          ${data.transfer.status}
        </td>
      </tr>

      ${
        data.transfer.reference
          ? `
      <tr style="border-top:1px solid #e5e7eb;">
        <td style="padding:12px 0;color:#374151;">Referencia</td>
        <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
          ${data.transfer.reference}
        </td>
      </tr>
      `
          : ""
      }

      ${
        data.transfer.description
          ? `
      <tr style="border-top:1px solid #e5e7eb;">
        <td style="padding:12px 0;color:#374151;">Descripción</td>
        <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">
          ${data.transfer.description}
        </td>
      </tr>
      `
          : ""
      }
    </table>

    <p style="margin-top:24px;color:#9ca3af;font-size:12px;">
      Ambiente: ${environment} · ID operación: ${data.transfer.uuid}
    </p>

    <p style="margin-top:8px;color:#9ca3af;font-size:12px;">
      Si no reconocés esta operación, comunicate con soporte.
    </p>

  </div>
</div>
`,
  };
}
