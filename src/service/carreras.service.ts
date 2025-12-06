import { NotFoundError } from "../common/utils/errors";
import { CarrerasDAO } from "../database/dao/carrera/carreraDAO";
import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";
import { IDataPaginator } from "../database/interfaces/db.types";
import { v4 as uuidv4 } from "uuid";
import {
  emitCarreraCreated,
  emitCarreraDeleted,
  emitCarreraUpdated,
} from "../events/carreras.publisher";

export class CarrerasService {
  private dao: CarrerasDAO;

  constructor(dao?: CarrerasDAO) {
    this.dao = dao ?? new CarrerasDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    name_carrera?: string;
  }): Promise<IDataPaginator<ICarrera>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit, { name_carrera: params?.name_carrera });
  }

  async getByUuid(uuid: string): Promise<ICarrera> {
    const event = await this.dao.getByUuid(uuid);
    if (!event) throw new NotFoundError(`Carrera ${uuid} no encontrada`);
    return event;
  }

  async create(body: ICarrera): Promise<ICarrera> {
    const payload = { ...body, uuid: uuidv4() };
    const created = await this.dao.create(payload);
    await emitCarreraCreated(created);
    return created;
  }

  async update(uuid: string, partial: Partial<ICarrera>): Promise<ICarrera> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Carrera ${uuid} no encontrada`);
    await emitCarreraUpdated(updated);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Carrera ${uuid} no encontrada`);
    await emitCarreraDeleted(uuid);
    return { ok };
  }
}

export default new CarrerasService();
