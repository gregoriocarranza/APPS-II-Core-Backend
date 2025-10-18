// src/controllers/calendar-events.controller.ts
import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import calendarEventsService, {
  CalendarEventsService,
} from "../../service/calendar-events.service";
import { ICalendarEvent } from "../../database/interfaces/calendar-event/calendar-event.interfaces";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";

export class CalendarEventsController implements IBaseController {
  constructor(private service: CalendarEventsService = calendarEventsService) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit, userId } = req.query;
      const user_id = Number(userId);
      if (!user_id || typeof user_id !== "number") {
        throw new Error("userUuid es obligatorio y debe ser una cadena");
      }
      const result = await this.service.getAllByUserUuid(user_id, {
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
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
      const event = await this.service.getByUuid(uuid);
      res.status(200).json({ success: true, data: event });
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
      const partial = req.body as Partial<ICalendarEvent>;
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

export default new CalendarEventsController();
