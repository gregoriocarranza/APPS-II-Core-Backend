import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ICurso } from "../../interfaces/cursos/cursos.interfaces";
import { CursoDTO } from "../../../common/dto/curso/curso.dto";
import { CursoCreateDTO } from "../../../common/dto/curso/create.curso.dto";

export class CursosDAO implements IBaseDAO<CursoCreateDTO> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: CursoCreateDTO): Promise<ICurso> {
    const [created] = await this._knex("cursos").insert(item).returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<CursoDTO | null> {
    const result = await this._knex("cursos")
      .select([
        "cursos.*",
        this._knex.raw(`row_to_json(materias.*) as materia`),
        this._knex.raw(`row_to_json(carreras.*) as carrera`),
      ])
      .leftJoin("materias", "materias.uuid", "cursos.uuid_materia")
      .leftJoin("carreras", "carreras.uuid", "materias.uuid_carrera")
      .where("cursos.uuid", uuid)
      .first();
    if (!result) return null;

    const dto = CursoDTO.build(result);

    return dto;
  }

  async update(uuid: string, item: Partial<ICurso>): Promise<ICurso | null> {
    const [updated] = await this._knex("cursos")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("cursos").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    where?: { uuid_carrera?: string }
  ): Promise<IDataPaginator<CursoDTO>> {
    const offset = (page - 1) * limit;

    const query = this._knex("cursos")
      .select([
        "cursos.*",
        this._knex.raw(`row_to_json(materias.*) as materia`),
        this._knex.raw(`row_to_json(carreras.*) as carrera`),
      ])
      .leftJoin("materias", "materias.uuid", "cursos.uuid_materia")
      .leftJoin("carreras", "carreras.uuid", "materias.uuid_carrera");

    if (where?.uuid_carrera) {
      query.where("carreras.uuid", where.uuid_carrera);
    }

    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const rows = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc");

    const data = rows.map((r) => CursoDTO.build(r));
    return {
      success: true,
      data,
      page,
      limit,
      count: data.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
