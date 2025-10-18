export interface HealthEmailData {
  success: boolean;
  health: string;
  version: string;
  environment: string;
  serviceName?: string;
  timestamp: number;
}

export function healthBodyText(data: HealthEmailData): string {
  const statusColor = data.success
    ? "#16a34a" /* verde */
    : "#dc2626"; /* rojo */
  const statusEmoji = data.success ? "✅" : "❌";

  return `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      <h2 style="margin:0 0 8px 0;color:#111827;">🩺 Health Check — ${data.serviceName}</h2>
      <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px;">
        Enviado automáticamente el <strong>${new Date(data.timestamp).toLocaleString("es-AR")}</strong>
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;color:#374151;font-size:15px;">Estado general</td>
          <td style="padding:12px 0;text-align:right;">
            <span style="display:inline-block;padding:6px 10px;border-radius:9999px;background:${statusColor};color:white;font-weight:600;">
              ${statusEmoji} ${data.success ? "OK" : "Fallo"}
            </span>
          </td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:15px;">Health</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${data.health}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:15px;">Versión</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${data.version}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:15px;">Ambiente</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${data.environment}</td>
        </tr>
      </table>

      <p style="margin-top:16px;color:#9ca3af;font-size:12px;">
        Si no esperabas este correo, podés ignorarlo.
      </p>
    </div>
  </div>
  `;
}
