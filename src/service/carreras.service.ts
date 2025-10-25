import { NotFoundError } from "../common/utils/errors";
import { CarrerasDAO } from "../database/dao/carrera/carreraDAO";
import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";
import { IDataPaginator } from "../database/interfaces/db.types";
import { v4 as uuidv4 } from "uuid";

export class CarrerasService {
  private dao: CarrerasDAO;

  constructor(dao?: CarrerasDAO) {
    this.dao = dao ?? new CarrerasDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<ICarrera>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<ICarrera> {
    const event = await this.dao.getByUuid(uuid);
    if (!event) throw new NotFoundError(`Carrera ${uuid} no encontrada`);
    return event;
  }

  async create(body: ICarrera): Promise<ICarrera> {
    const payload = { ...body, uuid: uuidv4() };
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<ICarrera>): Promise<ICarrera> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Carrera ${uuid} no encontrada`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Carrera ${uuid} no encontrada`);
    return { ok };
  }
}

export default new CarrerasService();
