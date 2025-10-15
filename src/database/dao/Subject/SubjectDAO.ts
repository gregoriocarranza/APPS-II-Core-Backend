// src/dao/SubjectDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ISubject } from "../../interfaces/subject/subject.interfaces";

export class SubjectDAO implements IBaseDAO<ISubject> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: ISubject): Promise<ISubject> {
    const [created] = await this._knex("subjects").insert(item).returning("*");
    return created;
  }

  async getById(uuid: string): Promise<ISubject | null> {
    const result = await this._knex("subjects")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(uuid: string, item: Partial<ISubject>): Promise<ISubject | null> {
    const [updated] = await this._knex("subjects")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("subjects").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    filters?: { name?: string }
  ): Promise<IDataPaginator<ISubject>> {
    const offset = (page - 1) * limit;

    let query = this._knex("subjects").select("*");

    // Apply filters
    if (filters?.name) {
      query = query.where("name", "ilike", `%${filters.name}%`);
    }

    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("id", "desc");

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
