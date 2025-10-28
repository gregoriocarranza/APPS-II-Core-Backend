import dotenv from "dotenv";
dotenv.config();

export interface MailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  defaultFrom?: string;
}

const mailerConfig: MailerConfig = {
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "maddison53@ethereal.email",
    pass: process.env.SMTP_PASS || "jn7jnAPss4f63QBp6D",
  },
  defaultFrom:
    process.env.SMTP_FROM || '"Maddison Foo Koch" <maddison53@ethereal.email>',
};

export default mailerConfig;
