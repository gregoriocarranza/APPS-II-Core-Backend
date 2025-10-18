import { NextFunction, Request, Response } from "express";
import { getServiceVersion } from "../../common/utils/version.resolver";
import { getServiceEnvironment } from "../../common/utils/environment.resolver";
import { EmailerService } from "../../service/mailer.service";
import { healthBodyText, HealthEmailData } from "./template";
import dotenv from "dotenv";
dotenv.config();
export class HealthController {
  constructor(private emailService: EmailerService = EmailerService.instance) {
    if (process.env.HEALTH_CHECK_SEND_EMAIL !== "true")
      console.log("The app will not send Health check imail info");
  }

  public async getHealthStatus(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let info = null;

      const version: string = await getServiceVersion();
      const environment: string = await getServiceEnvironment();
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

      if (process.env.HEALTH_CHECK_SEND_EMAIL === "true") {
        info = await this.emailService.sendMail({
          to:
            process.env.HEALTH_CHECK_DESTINATION ||
            "gregoriocarranza@hotmail.com",
          subject: "🩺 Health Check - " + serviceName,
          bodyType: "html",
          body: healthBodyText(emailData),
        });
      }

      console.log(new Date());

      res.status(200).json({
        success: true,
        health: "Up!",
        version,
        environment,
        timestamp,
        email_info: info,
      });
    } catch (err: any) {
      console.error("❌ Health check failed:", err.message);
      next(err);
    }
  }
}
