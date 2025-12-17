import { INotificacionDTO } from "../common/dto/notificaciones/Inotificaciones.dto";
import { bodyTypes } from "../common/dto/notificaciones/notificaciones.dto";
import { TemplateKey } from "../common/templates";
import { EventPayload } from "../common/templates/eventos_academicos_inicia.template";
import { GradeCreatedPayload } from "../common/templates/grade_notification";
import { ProposalPayload } from "../common/templates/proposal.template";
import { ReservationCreatedPayload } from "../common/templates/reserva.template";
import { SanctionBasePayload } from "../common/templates/sancion_biblioteca.template";
import { NotFoundError } from "../common/utils/errors";
import { DomainEvent } from "../rabbitMq/Publisher";
import { EmailerService } from "./mailer.service";
import { MateriasService } from "./materias.service";
import { NotificationsService } from "./notifications.service";
import { UserService } from "./user.service";
import { v4 as uuidv4 } from "uuid";

export class RabbitMQService {
  private userService: UserService;
  private emailerService: EmailerService;
  private notificationService: NotificationsService;
  private materiaService: MateriasService;

  constructor(
    userService?: UserService,
    emailerService?: EmailerService,
    notificationService?: NotificationsService,
    materiaService?: MateriasService
  ) {
    this.notificationService =
      notificationService ?? new NotificationsService();
    this.materiaService = materiaService ?? new MateriasService();
    this.userService = userService ?? new UserService();
    this.emailerService = emailerService ?? EmailerService.instance;
  }

  async handleAcademicEventsUpcomingNotificationCreated(
    event: DomainEvent<EventPayload>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.registerdUserIds) {
      throw new NotFoundError("registerdUserIds no encontrados");
    }

    if (!Array.isArray(event.payload.registerdUserIds)) {
      throw new NotFoundError("registerdUserIds no es una lista válida");
    }

    if (event.payload.registerdUserIds.length === 0) {
      throw new NotFoundError("registerdUserIds está vacío");
    }

    const templateFunction =
      await this.notificationService.getTemplateById(EmailType);

    const ids = event.payload.registerdUserIds;

    const results = await Promise.all(
      ids.map(async (userUuid) => {
        const user = await this.userService.getByUuid(userUuid);
        if (!user) throw new NotFoundError(`User ${userUuid} no encontrado`);

        const { body, title } = await templateFunction({
          payload: event.payload,
          user,
        });

        const notifPayload = INotificacionDTO.build({
          uuid: uuidv4(),
          user_uuid: user.uuid,
          body,
          metadata: event.payload,
          title,
        });

        const created = await this.notificationService.create(notifPayload);

        return this.emailerService.sendMail({
          to: user.email,
          subject: created.title,
          bodyType: bodyTypes.html,
          body: created.body,
        });
      })
    );

    return results;
  }

  async handleAcademicEventsNotificationCreated(
    event: DomainEvent<any>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.userId) throw new NotFoundError(`userId no encontrado`);

    const user = await this.userService.getByUuid(event.payload.userId);

    if (!user)
      throw new NotFoundError(`User ${event.payload.userId} no encontrado`);

    const templateFunction =
      await this.notificationService.getTemplateById(EmailType);

    const { body, title } = await templateFunction({
      payload: event.payload,
      user,
    });

    const payload = INotificacionDTO.build({
      uuid: uuidv4(),
      user_uuid: user.uuid,
      body,
      metadata: event.payload,
      title,
    });
    const created = await this.notificationService.create(payload);

    const info = await this.emailerService.sendMail({
      to: user.email,
      subject: created.title,
      bodyType: bodyTypes.html,
      body: created.body,
    });

    return info;
  }

  async handleProposalNotification(
    event: DomainEvent<ProposalPayload>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.teacherId)
      throw new NotFoundError(`studentId no encontrado`);

    const user = await this.userService.getByUuid(event.payload.teacherId);

    if (!user)
      throw new NotFoundError(`User ${event.payload.teacherId} no encontrado`);

    const materia = await this.materiaService.getByUuid(
      event.payload.subjectId
    );

    if (!materia)
      throw new NotFoundError(
        `materia ${event.payload.subjectId} no encontrada`
      );

    const templateFunction =
      await this.notificationService.getTemplateById(EmailType);

    const { body, title } = await templateFunction({
      payload: event.payload,
      user,
      subject: materia,
    });

    const payload = INotificacionDTO.build({
      uuid: uuidv4(),
      user_uuid: user.uuid,
      body,
      metadata: event.payload,
      title,
    });
    const created = await this.notificationService.create(payload);

    const info = await this.emailerService.sendMail({
      to: user.email,
      subject: created.title,
      bodyType: bodyTypes.html,
      body: created.body,
    });

    return info;
  }

  async handleGradeNotificationCreated(
    event: DomainEvent<GradeCreatedPayload>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.studentId)
      throw new NotFoundError(`studentId no encontrado`);

    const user = await this.userService.getByUuid(event.payload.studentId);

    if (!user)
      throw new NotFoundError(`User ${event.payload.studentId} no encontrado`);

    const templateFunction =
      await this.notificationService.getTemplateById(EmailType);

    const { body, title } = await templateFunction({ event, user });

    const payload = INotificacionDTO.build({
      uuid: uuidv4(),
      user_uuid: user.uuid,
      body,
      metadata: event.payload,
      title,
    });
    const created = await this.notificationService.create(payload);

    const info = await this.emailerService.sendMail({
      to: user.email,
      subject: created.title,
      bodyType: bodyTypes.html,
      body: created.body,
    });

    return info;
  }

  async handleSanctionNotificationCreated(
    event: DomainEvent<SanctionBasePayload>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.userId)
      throw new NotFoundError(`studentId no encontrado`);

    const user = await this.userService.getByUuid(event.payload.userId);

    if (!user)
      throw new NotFoundError(`User ${event.payload.userId} no encontrado`);

    const templateFunction =
      await this.notificationService.getTemplateById(EmailType);

    const { body, title } = await templateFunction({
      payload: event.payload,
      user,
    });

    const payload = INotificacionDTO.build({
      uuid: uuidv4(),
      user_uuid: user.uuid,
      body,
      metadata: event.payload,
      title,
    });
    const created = await this.notificationService.create(payload);

    const info = await this.emailerService.sendMail({
      to: user.email,
      subject: created.title,
      bodyType: bodyTypes.html,
      body: created.body,
    });

    return info;
  }

  async handleReservasNotificationCreated(
    event: DomainEvent<ReservationCreatedPayload>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.userId)
      throw new NotFoundError(`studentId no encontrado`);

    const user = await this.userService.getByUuid(event.payload.userId);

    if (!user)
      throw new NotFoundError(`User ${event.payload.userId} no encontrado`);

    const templateFunction =
      await this.notificationService.getTemplateById(EmailType);

    const { body, title } = await templateFunction({
      payload: event.payload,
      user,
    });

    const payload = INotificacionDTO.build({
      uuid: uuidv4(),
      user_uuid: user.uuid,
      body,
      metadata: event.payload,
      title,
    });
    const created = await this.notificationService.create(payload);

    const info = await this.emailerService.sendMail({
      to: user.email,
      subject: created.title,
      bodyType: bodyTypes.html,
      body: created.body,
    });

    return info;
  }
}

export default new RabbitMQService();
