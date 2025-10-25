// src/dao/CalendarEventDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ICalendarEvent } from "../../interfaces/calendar-event/calendar-event.interfaces";

export class CalendarEventDAO implements IBaseDAO<ICalendarEvent> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: ICalendarEvent): Promise<ICalendarEvent> {
    const [created] = await this._knex("calendar_events")
      .insert(item)
      .returning("*");
    return created;
  }

  async getByUuid(uuid: string): Promise<ICalendarEvent | null> {
    const result = await this._knex("calendar_events")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(
    uuid: string,
    item: Partial<ICalendarEvent>,
  ): Promise<ICalendarEvent | null> {
    const [updated] = await this._knex("calendar_events")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("calendar_events").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    filters?: {
      type?: string;
      location?: string;
      start_from?: string;
      start_to?: string;
    },
  ): Promise<IDataPaginator<ICalendarEvent>> {
    const offset = (page - 1) * limit;

    let query = this._knex("calendar_events").select("*");

    if (filters?.type) {
      query = query.where("type", filters.type);
    }
    if (filters?.location) {
      query = query.where("location", "ilike", `%${filters.location}%`);
    }
    if (filters?.start_from) {
      query = query.where("start_at", ">=", filters.start_from);
    }
    if (filters?.start_to) {
      query = query.where("start_at", "<=", filters.start_to);
    }

    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("start_at", "asc");

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

  async getByUser(
    page: number,
    limit: number,
    user_id: number,
  ): Promise<IDataPaginator<ICalendarEvent>> {
    const offset = (page - 1) * limit;

    let query = this._knex("calendar_events").select("*").where({ user_id });

    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("start_at", "asc");

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
