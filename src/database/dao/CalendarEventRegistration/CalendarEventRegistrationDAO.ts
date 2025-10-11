// src/dao/CalendarEventRegistrationDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ICalendarEventRegistration } from "../../interfaces/calendar-event-registration/calendar-event-registration.interfaces";

export class CalendarEventRegistrationDAO
  implements IBaseDAO<ICalendarEventRegistration>
{
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(
    item: ICalendarEventRegistration,
  ): Promise<ICalendarEventRegistration> {
    const [created] = await this._knex("calendar_event_registrations")
      .insert(item)
      .returning("*");
    return created;
  }

  async getById(uuid: string): Promise<ICalendarEventRegistration | null> {
    const result = await this._knex("calendar_event_registrations")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(
    uuid: string,
    item: Partial<ICalendarEventRegistration>,
  ): Promise<ICalendarEventRegistration | null> {
    const [updated] = await this._knex("calendar_event_registrations")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("calendar_event_registrations")
      .where({ uuid })
      .del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    filters?: {
      event_uuid?: string;
      user_uuid?: string;
      status?: string;
    },
  ): Promise<IDataPaginator<ICalendarEventRegistration>> {
    const offset = (page - 1) * limit;

    let query = this._knex("calendar_event_registrations").select("*");

    // Apply filters
    if (filters?.event_uuid) {
      query = query.where("event_uuid", filters.event_uuid);
    }
    if (filters?.user_uuid) {
      query = query.where("user_uuid", filters.user_uuid);
    }
    if (filters?.status) {
      query = query.where("status", filters.status);
    }

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

  async getByEvent(event_uuid: string): Promise<ICalendarEventRegistration[]> {
    return this._knex<ICalendarEventRegistration>(
      "calendar_event_registrations",
    )
      .select("*")
      .where({ event_uuid })
      .orderBy("created_at", "desc");
  }

  async getByUser(user_uuid: string): Promise<ICalendarEventRegistration[]> {
    return this._knex<ICalendarEventRegistration>(
      "calendar_event_registrations",
    )
      .select("*")
      .where({ user_uuid })
      .orderBy("created_at", "desc");
  }

  async getByEventAndUser(
    event_uuid: string,
    user_uuid: string,
  ): Promise<ICalendarEventRegistration | null> {
    const result = await this._knex("calendar_event_registrations")
      .select("*")
      .where({ event_uuid, user_uuid })
      .first();
    return result || null;
  }
}
