import { Router } from "express";
import { CalendarEventsController } from "../../controllers/calendar-events/calendar-events.controller";

export class CalendarEventsRouter {
  private _router: Router;
  private _calendarEventsController = new CalendarEventsController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      "/",
      this._calendarEventsController.getAll.bind(
        this._calendarEventsController,
      ),
    );
    this._router.get(
      "/:uuid",
      this._calendarEventsController.getByUuid.bind(
        this._calendarEventsController,
      ),
    );
    this._router.put(
      "/:uuid",
      this._calendarEventsController.update.bind(
        this._calendarEventsController,
      ),
    );
    this._router.post(
      "/",
      this._calendarEventsController.create.bind(
        this._calendarEventsController,
      ),
    );
    this._router.delete(
      "/:uuid",
      this._calendarEventsController.delete.bind(
        this._calendarEventsController,
      ),
    );
  }

  public get router(): Router {
    return this._router;
  }
}
