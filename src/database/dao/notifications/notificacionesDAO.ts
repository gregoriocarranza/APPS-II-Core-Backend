import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { INotificacion } from "../../interfaces/notification/notification.interfaces";

export class notificacionesDAO implements IBaseDAO<INotificacion> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: INotificacion): Promise<INotificacion> {
    const insert = {
      uuid: item.uuid,
      user_id: item.user_id,
      title: item.title,
      body: item.body,
      from: process.env.SMTP_USER || "placehoder@gmail.com",
    };

    const [created] = await this._knex("notificaciones")
      .insert(insert)
      .returning("*");
    return created;
  }

  async getById(uuid: string): Promise<INotificacion | null> {
    const result = await this._knex("notificaciones")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  /**
   *  * @deprecated Not supported. This DAO does not support updates.
   */
  async update(uuid: string, item: Partial<INotificacion>): Promise<any> {
    console.info("Function not suported");
    return "Function not suported";
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("notificaciones").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
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

  async getByUserId(
    user_id: number,
    page: number,
    limit: number,
  ): Promise<IDataPaginator<INotificacion>> {
    const offset = (page - 1) * limit;

    const query = this._knex("notificaciones").select("*").where({ user_id });

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
