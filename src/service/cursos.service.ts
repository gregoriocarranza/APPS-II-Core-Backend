import { CursoCreateDTO } from "../common/dto/curso/create.curso.dto";
import { CursoDTO } from "../common/dto/curso/curso.dto";
import { NotFoundError } from "../common/utils/errors";
import { CursosDAO } from "../database/dao/cursos/cursosDAO";
import { ICurso } from "../database/interfaces/cursos/cursos.interfaces";
import { IDataPaginator } from "../database/interfaces/db.types";
import { v4 as uuidv4 } from "uuid";
import {
  emitCursoCreated,
  emitCursoDeleted,
  emitCursoUpdated,
} from "../events/cursos.publisher";

export class CursosService {
  private dao: CursosDAO;

  constructor(dao?: CursosDAO) {
    this.dao = dao ?? new CursosDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<CursoDTO>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<CursoDTO> {
    const event = await this.dao.getByUuid(uuid);
    if (!event) throw new NotFoundError(`Curso ${uuid} no encontrado`);
    return event;
  }

  async create(body: CursoCreateDTO): Promise<ICurso> {
    const payload = { ...body, uuid: uuidv4() };
    const created = await this.dao.create(payload);
    await emitCursoCreated(created);
    return created;
  }

  async update(uuid: string, partial: Partial<ICurso>): Promise<ICurso> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Curso ${uuid} no encontrado`);
    await emitCursoUpdated(updated);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Curso ${uuid} no encontrado`);
    await emitCursoDeleted(uuid);
    return { ok };
  }
}

export default new CursosService();
