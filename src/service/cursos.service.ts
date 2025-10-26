import { NotFoundError } from "../common/utils/errors";
import { CursosDao } from "../database/dao/cursos/cursosDAO";
import { ICurso } from "../database/interfaces/cursos/cursos.interfaces";
import { IDataPaginator } from "../database/interfaces/db.types";
import { v4 as uuidv4 } from "uuid";

export class CursosService {
  private dao: CursosDao;

  constructor(dao?: CursosDao) {
    this.dao = dao ?? new CursosDao();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<ICurso>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<ICurso> {
    const event = await this.dao.getByUuid(uuid);
    if (!event) throw new NotFoundError(`Curso ${uuid} no encontrado`);
    return event;
  }

  async create(body: ICurso): Promise<ICurso> {
    const payload = { ...body, uuid: uuidv4() };
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<ICurso>): Promise<ICurso> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Curso ${uuid} no encontrado`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Curso ${uuid} no encontrado`);
    return { ok };
  }
}

export default new CursosService();
