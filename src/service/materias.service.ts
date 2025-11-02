import { NotFoundError } from "../common/utils/errors";
import { MateriasDAO } from "../database/dao/materia/materiaDAO";
import { CorrelativaDAO } from "../database/dao/materia/correlativaDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { v4 as uuidv4 } from "uuid";
import { IMateria } from "../database/interfaces/materia/materia.interfaces";
import { ICorrelativa } from "../database/interfaces/materia/correlativa.interface";
import { MateriaDTO } from "../common/dto/materia/materia.dto";

export class MateriasService {
  private dao: MateriasDAO;
  private correlativaDAO: CorrelativaDAO;

  constructor(dao?: MateriasDAO, correlativaDAO?: CorrelativaDAO) {
    this.dao = dao ?? new MateriasDAO();
    this.correlativaDAO = correlativaDAO ?? new CorrelativaDAO();
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

  async create(
    body: IMateria & { correlativas?: string[] }
  ): Promise<IMateria> {
    const { correlativas, ...materiaData } = body;
    const payload = { ...materiaData, uuid: uuidv4() };

    const createdMateria = await this.dao.create(payload);

    if (correlativas && correlativas.length > 0) {
      for (const uuidCorrelativa of correlativas) {
        const correlativaExists = await this.dao.getByUuid(uuidCorrelativa);
        if (!correlativaExists) {
          await this.dao.delete(createdMateria.uuid);
          throw new NotFoundError(
            `Materia correlativa ${uuidCorrelativa} no encontrada`
          );
        }

        const correlativa: ICorrelativa = {
          uuid_materia: createdMateria.uuid,
          uuid_materia_correlativa: uuidCorrelativa,
          created_at: new Date(),
        };

        await this.correlativaDAO.create(correlativa);
      }
    }

    return createdMateria;
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
