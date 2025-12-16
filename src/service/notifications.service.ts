import { TemplateFunction, TemplateKey, templates } from "../common/templates";
import { NotFoundError } from "../common/utils/errors";
import { notificacionesDAO } from "../database/dao/notification/notificacionesDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { INotificacion } from "../database/interfaces/notification/notification.interfaces";
import { emitnotificationCreated } from "../events/notification.publisher";

export class NotificationsService {
  private dao: notificacionesDAO;

  constructor(dao?: notificacionesDAO) {
    this.dao = dao ?? new notificacionesDAO();
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

  getTemplateById(key: TemplateKey): TemplateFunction {
    const template: TemplateFunction = templates[key] ?? null;
    if (!template)
      throw new NotFoundError(`template no encontrado con key  ${key} `);
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
}

export default new NotificationsService();
