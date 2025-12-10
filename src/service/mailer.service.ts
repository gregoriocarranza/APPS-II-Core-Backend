import nodemailer from "nodemailer";
import mailerConfig from "../common/config/mailer.config";
import { Attachment } from "nodemailer/lib/mailer";
import { bodyTypes } from "../common/dto/notificaciones/notificaciones.dto";

export class EmailerService {
  private static _instance: EmailerService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailerConfig.host,
      port: mailerConfig.port,
      secure: mailerConfig.secure,
      auth: mailerConfig.auth,
    });
  }

  static get instance(): EmailerService {
    if (!this._instance) {
      this._instance = new EmailerService();
    }
    return this._instance;
  }

  async sendMail(dest: {
    to: string;
    subject: string;
    bodyType: bodyTypes;
    body: string;
    attachments?: Attachment[];
  }): Promise<any> {
    const toSend: nodemailer.SendMailOptions = {
      from: mailerConfig.defaultFrom,
      to: dest.to,
      subject: dest.subject,
      [dest.bodyType]: dest.body,
      attachments: dest.attachments,
    };

    const info = await this.transporter.sendMail(toSend);

    console.log("✅ Message sent:", info.messageId);
    console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));

    return info;
  }
}
