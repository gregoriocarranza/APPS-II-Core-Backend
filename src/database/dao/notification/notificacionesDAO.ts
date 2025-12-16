import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { INotificacion } from "../../interfaces/notification/notification.interfaces";

export class notificacionesDAO implements IBaseDAO<INotificacion> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: INotificacion): Promise<INotificacion> {
    const insert = {
      uuid: item.uuid,
      user_uuid: item.user_uuid,
      title: item.title,
      body: item.body,
      from: process.env.SMTP_USER || "placehoder@gmail.com",
    };

    const [created] = await this._knex("notificaciones")
      .insert(insert)
      .returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<INotificacion | null> {
    const result = await this._knex("notificaciones")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(
    uuid: string,
    item: Partial<INotificacion>
  ): Promise<INotificacion | null> {
    const [updated] = await this._knex("notificaciones")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("notificaciones").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number
  ): Promise<IDataPaginator<INotificacion>> {
    const offset = (page - 1) * limit;

    const query = this._knex("notificaciones").select("*");

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

  async getByUserUuid(
    user_uuid: string,
    page: number,
    limit: number
  ): Promise<IDataPaginator<INotificacion>> {
    const offset = (page - 1) * limit;

    const query = this._knex("notificaciones").select("*").where({ user_uuid });

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
}
