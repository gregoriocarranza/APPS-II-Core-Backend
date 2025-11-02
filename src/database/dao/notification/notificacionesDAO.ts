import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { INotificacion } from "../../interfaces/notification/notification.interfaces";

export class notificacionesDAO implements IBaseDAO<INotificacion> {
  private get knex() {
    return KnexManager.getConnection();
  }

  async create(item: INotificacion): Promise<INotificacion> {
    const insert = {
      uuid: item.uuid,
      user_uuid: item.user_uuid,
      title: item.title,
      body: item.body,
      from: process.env.SMTP_USER || "placehoder@gmail.com",
    };

    const [created] = await this.knex("notificaciones")
      .insert(insert)
      .returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<INotificacion | null> {
    const result = await this.knex("notificaciones")
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
    const result = await this.knex("notificaciones").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
  ): Promise<IDataPaginator<INotificacion>> {
    const offset = (page - 1) * limit;

    const query = this.knex("notificaciones").select("*");

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

    const query = this.knex("notificaciones").select("*").where({ user_id });

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
