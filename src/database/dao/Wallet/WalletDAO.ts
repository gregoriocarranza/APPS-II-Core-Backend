// src/dao/WalletDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { IWallet } from "../../interfaces/wallet/wallet.interfaces";

export class WalletDAO implements IBaseDAO<IWallet> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: IWallet): Promise<IWallet> {
    const [created] = await this._knex("IWallet").insert(item).returning("*");
    return created;
  }

  async getById(uuid: string): Promise<IWallet | null> {
    const result = await this._knex("IWallet")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(uuid: string, item: Partial<IWallet>): Promise<IWallet | null> {
    const [updated] = await this._knex("wallets")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("wallets").where({ uuid }).del();
    return result > 0;
  }

  async getAll(page: number, limit: number): Promise<IDataPaginator<IWallet>> {
    const offset = (page - 1) * limit;

    const query = this._knex("IWallet").select("*");

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

  async getByUserId(user_id: string): Promise<IWallet[]> {
    return this._knex<IWallet>("wallets")
      .select("*")
      .where({ user_id })
      .orderBy("created_at", "desc");
  }
}
