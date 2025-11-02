// src/dao/WalletDAO.ts
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { IUser } from "../../interfaces/user/user.interfaces";

export class UserDAO implements IBaseDAO<IUser> {
  private get knex() {
    return KnexManager.getConnection();
  }

  async create(item: IUser): Promise<IUser> {
    const [created] = await this.knex("users").insert(item).returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<IUser | null> {
    const result = await this.knex("users")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(uuid: string, item: Partial<IUser>): Promise<IUser | null> {
    const [updated] = await this.knex("users")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this.knex("users").where({ uuid }).del();
    return result > 0;
  }

  async getAll(page: number, limit: number): Promise<IDataPaginator<IUser>> {
    const offset = (page - 1) * limit;

    const query = this.knex("users").select("*");

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

  async getByEmail(email: string): Promise<IUser | undefined> {
    return this.knex<IUser>("users").select("*").where({ email }).first();
  }
}
