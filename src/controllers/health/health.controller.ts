import { NextFunction, Request, Response } from "express";
import { getServiceVersion } from "../../common/utils/version.resolver";
import { getServiceEnvironment } from "../../common/utils/environment.resolver";
import { EmailerService } from "../../service/mailer.service";
import { healthBodyText, HealthEmailData } from "./template";
import dotenv from "dotenv";
import { getAllowedOrigins } from "../../common/config/origins/origins.config";
import { bodyTypes } from "../../common/dto/notificaciones/notificaciones.dto";
dotenv.config();
export class HealthController {
  constructor(private emailService: EmailerService = EmailerService.instance) {
    if (process.env.HEALTH_CHECK_SEND_EMAIL !== "true")
      console.log("The app will not send Health check imail info");
  }

  public async getHealthStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let info = null;
      const { sendEmail } = req.query;
      const version: string = await getServiceVersion();
      const environment: string = await getServiceEnvironment();
      const origins: string[] = getAllowedOrigins();
      const timestamp: number = new Date().getTime();
      const serviceName: string = process.env.APP_NAME || "Edu App";

      const emailData: HealthEmailData = {
        success: true,
        health: "Up!",
        version,
        environment,
        serviceName,
        timestamp,
      };

      if (
        process.env.HEALTH_CHECK_SEND_EMAIL === "true" ||
        sendEmail === "true"
      ) {
        info = await this.emailService.sendMail({
          to:
            process.env.HEALTH_CHECK_DESTINATION ||
            "gregoriocarranza@hotmail.com",
          subject: "🩺 Health Check - " + serviceName,
          bodyType: bodyTypes.html,
          body: healthBodyText(emailData),
        });
      }
      res.status(200).json({
        success: true,
        health: "Up!",
        version,
        environment,
        origins,
        timestamp,
        email_info: info,
      });
    } catch (err: any) {
      console.error("❌ Health check failed:", err.message);
      next(err);
    }
  }
}
