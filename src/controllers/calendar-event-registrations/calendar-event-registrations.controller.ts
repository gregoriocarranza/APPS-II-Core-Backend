// src/controllers/calendar-event-registrations.controller.ts
import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import calendarEventRegistrationsService, {
  CalendarEventRegistrationsService,
} from "../../service/calendar-event-registrations.service";
import { ICalendarEventRegistration } from "../../database/interfaces/calendar-event-registration/calendar-event-registration.interfaces";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";

export class CalendarEventRegistrationsController implements IBaseController {
  constructor(
    private service: CalendarEventRegistrationsService = calendarEventRegistrationsService,
  ) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit, event_uuid, user_uuid, status } = req.query as {
        page?: string;
        limit?: string;
        event_uuid?: string;
        user_uuid?: string;
        status?: string;
      };

      const result = await this.service.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
        event_uuid,
        user_uuid,
        status,
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  public async getByUuid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const registration = await this.service.getByUuid(uuid);
      res.status(200).json({ success: true, data: registration });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = { ...req.body, uuid: uuidv4() };
      const created = await this.service.create(payload);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      if (err.message && err.message.includes("duplicado")) {
        res.status(400).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const partial = req.body as Partial<ICalendarEventRegistration>;
      const updated = await this.service.update(uuid, partial);
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      await this.service.delete(uuid);
      res.status(204).end();
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }
}

export default new CalendarEventRegistrationsController();
