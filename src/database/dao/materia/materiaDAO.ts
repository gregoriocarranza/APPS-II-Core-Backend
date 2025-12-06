import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { IMateria } from "../../interfaces/materia/materia.interfaces";
import { MateriaDTO } from "../../../common/dto/materia/materia.dto";

export class MateriasDAO implements IBaseDAO<IMateria> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: IMateria): Promise<IMateria> {
    const [created] = await this._knex("materias").insert(item).returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<MateriaDTO | null> {
    const result = await this._knex("materias")
      .select([
        "materias.*",
        this._knex.raw(`row_to_json(carreras.*) as carrera`),
      ])
      .leftJoin("carreras", "carreras.uuid", "materias.uuid_carrera")
      .where("materias.uuid", uuid)
      .first();
    if (!result) return null;

    const dto = MateriaDTO.build(result);

    return dto;
  }

  async update(
    uuid: string,
    item: Partial<IMateria>
  ): Promise<IMateria | null> {
    const [updated] = await this._knex("materias")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("materias").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    where?: { uuid_carrera?: string; name_materia?: string }
  ): Promise<IDataPaginator<MateriaDTO>> {
    const offset = (page - 1) * limit;

    const query = this._knex("materias")
      .select([
        "materias.*",
        this._knex.raw(`row_to_json(carreras.*) as carrera`),
      ])
      .leftJoin("carreras", "carreras.uuid", "materias.uuid_carrera");

    if (where?.uuid_carrera) {
      query.where("carreras.uuid", where.uuid_carrera);
    }
    if (where?.name_materia) {
      query.where("materias.nombre", where.name_materia);
    }
    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const rows = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc");

    const data = rows.map((r) => MateriaDTO.build(r));

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

  async getByUserId(uuid: string): Promise<IMateria | undefined> {
    return this._knex<IMateria>("materias").select("*").where({ uuid }).first();
  }
}
