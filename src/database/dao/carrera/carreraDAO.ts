import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ICarrera } from "../../interfaces/carrera/carreras.interfaces";

export class CarrerasDAO implements IBaseDAO<ICarrera> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: ICarrera): Promise<ICarrera> {
    const [created] = await this._knex("carreras").insert(item).returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<ICarrera | null> {
    const result = await this._knex("carreras")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(
    uuid: string,
    item: Partial<ICarrera>,
  ): Promise<ICarrera | null> {
    const [updated] = await this._knex("carreras")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("carreras").where({ uuid }).del();
    return result > 0;
  }

  async getAll(page: number, limit: number): Promise<IDataPaginator<ICarrera>> {
    const offset = (page - 1) * limit;

    const query = this._knex("carreras").select("*");

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

  async getByUserId(uuid: string): Promise<ICarrera | undefined> {
    return this._knex<ICarrera>("carreras").select("*").where({ uuid }).first();
  }
}
