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
import { CarrerasDAO } from "../database/dao/carrera/carreraDAO";
import { MateriasDAO } from "../database/dao/materia/materiaDAO";

export class CursosService {
  private dao: CursosDAO;
  private carrerasDAO: CarrerasDAO;
  private materiasDAO: MateriasDAO;

  constructor(
    dao?: CursosDAO,
    carrerasDAO?: CarrerasDAO,
    materiasDAO?: MateriasDAO
  ) {
    this.dao = dao ?? new CursosDAO();
    this.carrerasDAO = carrerasDAO ?? new CarrerasDAO();
    this.materiasDAO = materiasDAO ?? new MateriasDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    uuid_carrera?: string;
    uuid_materia?: string;
    sede_curso?: string;
    turno_curso?: string;
  }): Promise<IDataPaginator<CursoDTO>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    if (params?.uuid_carrera) {
      const curso = await this.carrerasDAO.getByUuid(params?.uuid_carrera);
      if (!curso)
        throw new NotFoundError(`curso ${params?.uuid_carrera} no encontrado`);
    }

    if (params?.uuid_materia) {
      const materia = await this.materiasDAO.getByUuid(params?.uuid_materia);
      if (!materia)
        throw new NotFoundError(
          `materia ${params?.uuid_materia} no encontrado`
        );
    }
    return this.dao.getAll(page, limit, {
      uuid_carrera: params?.uuid_carrera,
      uuid_materia: params?.uuid_materia,
      sede_curso: params?.sede_curso,
      turno_curso: params?.turno_curso,
    });
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
