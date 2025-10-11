import { NotFoundError } from "../common/utils/errors";
import { CalendarEventRegistrationDAO } from "../database/dao/CalendarEventRegistration/CalendarEventRegistrationDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { ICalendarEventRegistration } from "../database/interfaces/calendar-event-registration/calendar-event-registration.interfaces";

export class CalendarEventRegistrationsService {
  private dao: CalendarEventRegistrationDAO;

  constructor(dao?: CalendarEventRegistrationDAO) {
    this.dao = dao ?? new CalendarEventRegistrationDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    event_uuid?: string;
    user_uuid?: string;
    status?: string;
  }): Promise<IDataPaginator<ICalendarEventRegistration>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));

    const filters = {
      event_uuid: params?.event_uuid,
      user_uuid: params?.user_uuid,
      status: params?.status,
    };

    return this.dao.getAll(page, limit, filters);
  }

  async getByUuid(uuid: string): Promise<ICalendarEventRegistration> {
    const registration = await this.dao.getById(uuid);
    if (!registration)
      throw new NotFoundError(
        `Calendar event registration ${uuid} no encontrada`,
      );
    return registration;
  }

  async getByEvent(event_uuid: string): Promise<ICalendarEventRegistration[]> {
    return this.dao.getByEvent(event_uuid);
  }

  async getByUser(user_uuid: string): Promise<ICalendarEventRegistration[]> {
    return this.dao.getByUser(user_uuid);
  }

  async create(
    payload: ICalendarEventRegistration,
  ): Promise<ICalendarEventRegistration> {
    // Check if registration already exists
    const existing = await this.dao.getByEventAndUser(
      payload.event_uuid,
      payload.user_uuid,
    );
    if (existing) {
      throw new Error(
        "El usuario ya está inscrito en este evento. Registro duplicado.",
      );
    }
    return this.dao.create(payload);
  }

  async update(
    uuid: string,
    partial: Partial<ICalendarEventRegistration>,
  ): Promise<ICalendarEventRegistration> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated)
      throw new NotFoundError(
        `Calendar event registration ${uuid} no encontrada`,
      );
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok)
      throw new NotFoundError(
        `Calendar event registration ${uuid} no encontrada`,
      );
    return { ok };
  }
}

export default new CalendarEventRegistrationsService();
