// src/dao/TransferDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ITransfer } from "../../interfaces/transfer/transfer.interface";


export class TransferDAO implements IBaseDAO<ITransfer> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: ITransfer): Promise<ITransfer> {
    const [created] = await this._knex("transfers").insert(item).returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<ITransfer | null> {
    const result = await this._knex("transfers")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(uuid: string, item: Partial<ITransfer>): Promise<ITransfer | null> {
    const [updated] = await this._knex("transfers")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("transfers").where({ uuid }).del();
    return result > 0;
  }

  async getAll(page: number, limit: number): Promise<IDataPaginator<ITransfer>> {
    const offset = (page - 1) * limit;

    const query = this._knex("transfers").select("*");

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

  async getByWallet(walletUuid: string): Promise<ITransfer[]> {
    return this._knex<ITransfer>("transfers")
      .select("*")
      .where((qb) => {
        qb.where("from_wallet_uuid", walletUuid)
          .orWhere("to_wallet_uuid", walletUuid);
      })
      .orderBy("created_at", "desc");
  }

  async getByStatus(status: string): Promise<ITransfer[]> {
    return this._knex<ITransfer>("transfers")
      .select("*")
      .where({ status })
      .orderBy("created_at", "desc");
  }
}
