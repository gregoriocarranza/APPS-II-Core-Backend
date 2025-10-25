import { NotFoundError } from "../common/utils/errors";
import { notificacionesDAO } from "../database/dao/notification/notificacionesDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { INotificacion } from "../database/interfaces/notification/notification.interfaces";

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

  async getByUserId(params: {
    user_id: number;
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<INotificacion>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getByUserId(params.user_id, page, limit);
  }

  async create(payload: INotificacion): Promise<INotificacion> {
    return this.dao.create(payload);
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
