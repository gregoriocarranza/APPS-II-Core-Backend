import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { IMateria } from "../../interfaces/materia/materia.interfaces";

export class MateriasDAO implements IBaseDAO<IMateria> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: IMateria): Promise<IMateria> {
    const [created] = await this._knex("materias").insert(item).returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<IMateria | null> {
    const result = await this._knex("materias")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(
    uuid: string,
    item: Partial<IMateria>,
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

  async getAll(page: number, limit: number): Promise<IDataPaginator<IMateria>> {
    const offset = (page - 1) * limit;

    const query = this._knex("materias").select("*");

    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc");

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
