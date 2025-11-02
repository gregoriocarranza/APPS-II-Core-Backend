import { ConsumeMessage } from "amqplib";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import { Attachment } from "nodemailer/lib/mailer";
import BaseConsumer from "../consumer.base";
import rabbitConfig from "../../config/rabbit.config";
import { NotificationsService } from "../../service/notifications.service";
import { UserService } from "../../service/user.service";
import { EmailerService } from "../../service/mailer.service";
import {
  NotificationCreatedByTypeDTO,
  attachmentClass,
} from "../../common/dto/notificaciones/create.notificaciones.dto";
import { NotFoundError } from "../../common/utils/errors";
import { INotificacionDTO } from "../../common/dto/notificaciones/Inotificaciones.dto";
import { bodyTypes } from "../../common/dto/notificaciones/notificaciones.dto";
import type { NotificationCreatedDTO } from "../../common/dto/notificaciones/notificaciones.dto";

export type NotificationQueueMessage = NotificationCreatedByTypeDTO &
  Record<string, unknown>;

export class NotificationsConsumer extends BaseConsumer<NotificationQueueMessage> {
  private readonly notificationsService = new NotificationsService();
  private readonly userService = new UserService();
  private readonly emailerService = EmailerService.instance;

  constructor(
    queueName: string = rabbitConfig.queues.notifications,
  ) {
    super(queueName);
  }

  protected override async onMessage(
    payload: NotificationQueueMessage,
    message: ConsumeMessage,
  ): Promise<void> {
    const dto = this.validatePayload(payload);
    const user = await this.userService.getByUuid(dto.userUuid);

    const templateFn =
      this.notificationsService.getTemplateById(dto.EmailType);
    if (!templateFn) {
      throw new NotFoundError(
        `Template not found for key ${dto.EmailType}`,
      );
    }

    const templateResult = await templateFn(payload);
    const attachments = dto.attachments ?? [];
    const notificationToPersist = INotificacionDTO.build({
      uuid: (payload.uuid as string) ?? uuidv4(),
      userUuid: dto.userUuid,
      title: templateResult.title,
      body: templateResult.body,
      attachments,
    } as NotificationCreatedDTO);

    const created = await this.notificationsService.create(
      notificationToPersist,
    );

    await this.emailerService.sendMail({
      to: user.email,
      subject: templateResult.title,
      bodyType: bodyTypes.html,
      body: templateResult.body,
      attachments: this.toMailerAttachments(attachments),
    });

    console.info(
      `[RabbitMQ] Processed notification "${created.uuid}" for user ${dto.userUuid} (message id: ${
        message.properties.messageId ?? "N/A"
      })`,
    );
  }

  private validatePayload(
    payload: NotificationQueueMessage,
  ): NotificationCreatedByTypeDTO {
    const dto = plainToInstance(NotificationCreatedByTypeDTO, payload, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto, { whitelist: true });
    if (errors.length > 0) {
      throw new Error(`Invalid notification payload: ${JSON.stringify(errors)}`);
    }
    return dto;
  }

  private toMailerAttachments(
    attachments?: attachmentClass[],
  ): Attachment[] | undefined {
    if (!attachments?.length) return undefined;
    return attachments.map((attachment) => ({
      filename: attachment.filename,
      href: attachment.href,
    }));
  }
}

export default NotificationsConsumer;
