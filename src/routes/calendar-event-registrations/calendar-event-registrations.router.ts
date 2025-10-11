import { Router } from "express";
import { CalendarEventRegistrationsController } from "../../controllers/calendar-event-registrations/calendar-event-registrations.controller";

export class CalendarEventRegistrationsRouter {
  private _router: Router;
  private _calendarEventRegistrationsController =
    new CalendarEventRegistrationsController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      "/",
      this._calendarEventRegistrationsController.getAll.bind(
        this._calendarEventRegistrationsController,
      ),
    );
    this._router.get(
      "/:uuid",
      this._calendarEventRegistrationsController.getByUuid.bind(
        this._calendarEventRegistrationsController,
      ),
    );
    this._router.put(
      "/:uuid",
      this._calendarEventRegistrationsController.update.bind(
        this._calendarEventRegistrationsController,
      ),
    );
    this._router.post(
      "/",
      this._calendarEventRegistrationsController.create.bind(
        this._calendarEventRegistrationsController,
      ),
    );
    this._router.delete(
      "/:uuid",
      this._calendarEventRegistrationsController.delete.bind(
        this._calendarEventRegistrationsController,
      ),
    );
  }

  public get router(): Router {
    return this._router;
  }
}
