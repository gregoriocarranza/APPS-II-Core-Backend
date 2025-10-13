import { NotFoundError } from "../common/utils/errors";
import { CalendarEventDAO } from "../database/dao/CalendarEvent/CalendarEventDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { ICalendarEvent } from "../database/interfaces/calendar-event/calendar-event.interfaces";

export class CalendarEventsService {
  private dao: CalendarEventDAO;

  constructor(dao?: CalendarEventDAO) {
    this.dao = dao ?? new CalendarEventDAO();
  }

  async getAllByUserUuid(
    userUuid: number,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<IDataPaginator<ICalendarEvent>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));

    return this.dao.getByUser(page, limit, userUuid);
  }

  async getByUuid(uuid: string): Promise<ICalendarEvent> {
    const event = await this.dao.getById(uuid);
    if (!event) throw new NotFoundError(`Calendar event ${uuid} no encontrado`);
    return event;
  }

  async create(payload: ICalendarEvent): Promise<ICalendarEvent> {
    return this.dao.create(payload);
  }

  async update(
    uuid: string,
    partial: Partial<ICalendarEvent>
  ): Promise<ICalendarEvent> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated)
      throw new NotFoundError(`Calendar event ${uuid} no encontrado`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Calendar event ${uuid} no encontrado`);
    return { ok };
  }
}

export default new CalendarEventsService();
