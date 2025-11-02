import dotenv from "dotenv";
import { TemplateReturn } from ".";
import { getServiceVersion } from "../utils/version.resolver";
import { getServiceEnvironment } from "../utils/environment.resolver";
dotenv.config();

export function healthBodyText(): TemplateReturn {
  const serviceName: string = process.env.APP_NAME || "Edu App";
  const version: string = getServiceVersion();
  const environment: string = getServiceEnvironment();
  const timestamp: number = new Date().getTime();
  return {
    body: `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7f9; padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      <h2 style="margin:0 0 8px 0;color:#111827;">🩺 Health Check — ${serviceName}</h2>
      <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px;">
        Enviado automáticamente el <strong>${new Date(timestamp).toLocaleString("es-AR")}</strong>
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:15px;">Versión</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${version}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0;color:#374151;font-size:15px;">Ambiente</td>
          <td style="padding:12px 0;text-align:right;color:#111827;font-weight:600;">${environment}</td>
        </tr>
      </table>

      <p style="margin-top:16px;color:#9ca3af;font-size:12px;">
        Si no esperabas este correo, podés ignorarlo.
      </p>
    </div>
  </div>
  `,
    title: "🩺 Health Check - " + serviceName,
  };
}
