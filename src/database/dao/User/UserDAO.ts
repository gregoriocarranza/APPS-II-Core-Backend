// src/dao/UserDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { IUser } from "../../interfaces/user/user.interfaces";

export class UserDAO implements IBaseDAO<IUser> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: IUser): Promise<IUser> {
    const [created] = await this._knex("users").insert(item).returning("*");
    return created;
  }

  async getById(uuid: string): Promise<IUser | null> {
    const result = await this._knex("users")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(uuid: string, item: Partial<IUser>): Promise<IUser | null> {
    const [updated] = await this._knex("users")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("users").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    filters?: { name?: string; email?: string }
  ): Promise<IDataPaginator<IUser>> {
    const offset = (page - 1) * limit;

    let query = this._knex("users").select("*");

    // Apply filters
    if (filters?.name) {
      query = query.where("name", "ilike", `%${filters.name}%`);
    }
    if (filters?.email) {
      query = query.where("email", "ilike", `%${filters.email}%`);
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
