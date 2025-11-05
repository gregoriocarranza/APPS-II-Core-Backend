import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { IInscripcion } from "../../interfaces/inscripciones/inscripciones.interfaces";
import { ToInscripcionDTO } from "../../../common/dto/inscripciones/inscriopciones.dto";
import { NotFoundError } from "../../../common/utils/errors";
import { ToIInscripcionesDTO } from "../../../common/dto/inscripciones/inscriopciones.interface.dto";

export class InscripcionesDAO implements IBaseDAO<IInscripcion> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: ToIInscripcionesDTO): Promise<ToInscripcionDTO> {
    const [created] = await this._knex("inscripciones")
      .insert(item)
      .returning("*");

    const result = await this.getByUuid(created.uuid);
    if (!result)
      throw new NotFoundError(`inscripcion ${created.uuid} no encontrada`);
    return result;
  }

  async getByUuid(uuid: string): Promise<ToInscripcionDTO | null> {
    const result = await this._knex("inscripciones")
      .select([
        "inscripciones.*",
        this._knex.raw(`row_to_json(users.*) as user`),
        this._knex.raw(`row_to_json(cursos.*) as curso`),
      ])
      .leftJoin("users", "users.uuid", "inscripciones.user_uuid")
      .leftJoin("cursos", "cursos.uuid", "inscripciones.uuid_curso")
      .where("inscripciones.uuid", uuid)
      .first();
    if (!result) return null;

    const dto = ToInscripcionDTO.build(result);

    return dto;
  }

  async update(
    uuid: string,
    item: Partial<IInscripcion>
  ): Promise<ToInscripcionDTO> {
    const [updated] = await this._knex("inscripciones")
      .where({ uuid })
      .update(item)
      .returning("*");

    const result = await this.getByUuid(updated.uuid);
    if (!result)
      throw new NotFoundError(`inscripcion ${updated.uuid} no encontrada`);
    return result;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("inscripciones").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    where?: { uuid_curso?: string; user_uuid?: string }
  ): Promise<IDataPaginator<ToInscripcionDTO>> {
    const offset = (page - 1) * limit;

    const query = this._knex("inscripciones")
      .select([
        "inscripciones.*",
        this._knex.raw(`row_to_json(users.*) as user`),
        this._knex.raw(`row_to_json(cursos.*) as cursos`),
      ])
      .leftJoin("users", "users.uuid", "inscripciones.user_uuid")
      .leftJoin("cursos", "cursos.uuid", "inscripciones.uuid_curso");

    if (where?.uuid_curso) {
      query.where("inscripciones.uuid_curso", where.uuid_curso);
    }

    if (where?.user_uuid) {
      query.where("inscripciones.user_uuid", where.user_uuid);
    }
    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const rows = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc");

    const data = rows.map((r) => ToInscripcionDTO.build(r));
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
