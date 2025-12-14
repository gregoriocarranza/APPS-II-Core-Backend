import { INotificacionDTO } from "../common/dto/notificaciones/Inotificaciones.dto";
import { bodyTypes } from "../common/dto/notificaciones/notificaciones.dto";
import { TemplateFunction, TemplateKey, templates } from "../common/templates";
import { NotFoundError } from "../common/utils/errors";
import { notificacionesDAO } from "../database/dao/notification/notificacionesDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { INotificacion } from "../database/interfaces/notification/notification.interfaces";
import { emitnotificationCreated } from "../events/notification.publisher";
import { DomainEvent } from "../rabbitMq/Publisher";
import { EmailerService } from "./mailer.service";
import { UserService } from "./user.service";
import { v4 as uuidv4 } from "uuid";

export class NotificationsService {
  private dao: notificacionesDAO;
  private userService: UserService;
  private emailerService: EmailerService;

  constructor(
    dao?: notificacionesDAO,
    userService?: UserService,
    emailerService?: EmailerService
  ) {
    this.dao = dao ?? new notificacionesDAO();
    this.userService = userService ?? new UserService();
    this.emailerService = emailerService ?? EmailerService.instance;
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<INotificacion>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<INotificacion> {
    const wallet = await this.dao.getByUuid(uuid);
    if (!wallet) throw new NotFoundError(`Notificacion ${uuid} no encontrada`);
    return wallet;
  }

  async getByuserUuid(params: {
    user_uuid: string;
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<INotificacion>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getByUserUuid(params.user_uuid, page, limit);
  }

  async create(payload: INotificacion): Promise<INotificacion> {
    const created = await this.dao.create(payload);
    await emitnotificationCreated(created);
    return created;
  }

  getTemplateById(key: TemplateKey): TemplateFunction | null {
    const template: TemplateFunction = templates[key] ?? null;
    return template;
  }

  async update(uuid: string, partial: Partial<INotificacion>): Promise<any> {
    console.info("Function not suported");
    return "Function not suported";
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Notificacion ${uuid} no encontrada`);
    return { ok };
  }

  async handleNotificationCreated(
    event: DomainEvent<any>,
    EmailType: TemplateKey
  ): Promise<any> {
    if (!event.payload.userId) throw new NotFoundError(`userId no encontrado`);

    const user = await this.userService.getByUuid(event.payload.userId);

    if (!user)
      throw new NotFoundError(`User ${event.payload.userId} no encontrado`);

    const templateFunction = await this.getTemplateById(EmailType);

    if (!templateFunction)
      throw new NotFoundError(`template no encontrado con key  ${EmailType} `);

    const { body, title } = await templateFunction({ event, user });

    const payload = INotificacionDTO.build({
      uuid: uuidv4(),
      user_uuid: user.uuid,
      body,
      title,
    });
    const created = await this.create(payload);

    const info = await this.emailerService.sendMail({
      to: user.email,
      subject: created.title,
      bodyType: bodyTypes.html,
      body: created.body,
    });

    return info;
  }
}

export default new NotificationsService();
