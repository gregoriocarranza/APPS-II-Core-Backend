import { NotFoundError } from "../common/utils/errors";
import { MateriasDAO } from "../database/dao/materia/materiaDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { v4 as uuidv4 } from "uuid";
import { IMateria } from "../database/interfaces/materia/materia.interfaces";
import { MateriaDTO } from "../common/dto/materia/materia.dto";

export class MateriasService {
  private dao: MateriasDAO;

  constructor(dao?: MateriasDAO) {
    this.dao = dao ?? new MateriasDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<MateriaDTO>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<MateriaDTO> {
    const materia = await this.dao.getByUuid(uuid);
    if (!materia) throw new NotFoundError(`materia ${uuid} no encontrada`);
    return materia;
  }

  async create(body: IMateria): Promise<IMateria> {
    const payload = { ...body, uuid: uuidv4() };
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<IMateria>): Promise<IMateria> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`materia ${uuid} no encontrada`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`materia ${uuid} no encontrada`);
    return { ok };
  }
}

export default new MateriasService();
