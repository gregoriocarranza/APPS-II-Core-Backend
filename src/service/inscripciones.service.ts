import { NotFoundError, ConflictError } from "../common/utils/errors";
import { IDataPaginator } from "../database/interfaces/db.types";
import { InscripcionEstadoEnum } from "../database/interfaces/inscripciones/inscripciones.interfaces";
import { InscripcionesDAO } from "../database/dao/Inscripciones/inscripcionesDAO";
import { ToInscripcionDTO } from "../common/dto/inscripciones/inscriopciones.dto";
import { CursosDAO } from "../database/dao/cursos/cursosDAO";
import { ToIInscripcionesDTO } from "../common/dto/inscripciones/inscriopciones.interface.dto";

export class InscripcionesService {
  private dao: InscripcionesDAO;
  private cursosDAO: CursosDAO;
  defaultPage: number;
  defaultLimit: number;

  constructor(dao?: InscripcionesDAO, cursosDAO?: CursosDAO) {
    this.dao = dao ?? new InscripcionesDAO();
    this.cursosDAO = cursosDAO ?? new CursosDAO();

    this.defaultPage = 1;
    this.defaultLimit = 20;
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    uuid_curso?: string;
    user_uuid?: string;
  }): Promise<IDataPaginator<ToInscripcionDTO>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    if (params?.uuid_curso) {
      const curso = await this.cursosDAO.getByUuid(params?.uuid_curso);
      if (!curso)
        throw new NotFoundError(`curso ${params?.uuid_curso} no encontrado`);
    }
    return this.dao.getAll(page, limit, {
      uuid_curso: params?.uuid_curso,
      user_uuid: params?.user_uuid,
    });
  }

  async getByUuid(uuid: string): Promise<ToInscripcionDTO> {
    const inscripcion = await this.dao.getByUuid(uuid);
    if (!inscripcion)
      throw new NotFoundError(`inscripción ${uuid} no encontrada`);
    return inscripcion;
  }

  async create(body: ToIInscripcionesDTO): Promise<ToInscripcionDTO> {
    const curso = await this.cursosDAO.getByUuid(body.uuid_curso);
    if (!curso)
      throw new NotFoundError(`curso ${body.uuid_curso} no encontrado`);

    const already = await this.dao.getAll(this.defaultPage, this.defaultLimit, {
      uuid_curso: body?.uuid_curso,
      user_uuid: body?.user_uuid,
    });
    if (already.data.length > 0) {
      throw new ConflictError(
        `El alumno ${body.user_uuid} ya está inscripto en el curso ${body.uuid_curso}`
      );
    }
    const created = await this.dao.create(body);
    return created;
  }

  async update(
    uuid: string,
    partial: Partial<ToIInscripcionesDTO>
  ): Promise<ToInscripcionDTO> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`inscripción ${uuid} no encontrada`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`inscripción ${uuid} no encontrada`);
    return { ok };
  }

  // ---------- Helpers de estado ----------

  async confirmar(uuid: string): Promise<ToInscripcionDTO> {
    const insc = await this.dao.getByUuid(uuid);
    if (!insc) throw new NotFoundError(`inscripción ${uuid} no encontrada`);

    if (insc.estado === InscripcionEstadoEnum.CONFIRMADA) return insc;

    const updated = await this.dao.update(uuid, {
      estado: InscripcionEstadoEnum.CONFIRMADA,
      updated_at: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError(`inscripción ${uuid} no encontrada`);
    return updated;
  }

  async darBaja(uuid: string, razon = ""): Promise<ToInscripcionDTO> {
    const insc = await this.dao.getByUuid(uuid);
    if (!insc) throw new NotFoundError(`inscripción ${uuid} no encontrada`);

    const updated = await this.dao.update(uuid, {
      estado: InscripcionEstadoEnum.BAJA,
      razon,
      fecha_baja: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError(`inscripción ${uuid} no encontrada`);
    return updated;
  }
}

export default new InscripcionesService();
