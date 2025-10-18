import { Router } from "express";
import { NotificationsController } from "../../controllers/notifications/notifications.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { NotificationCreatedDTO } from "../../common/dto/notificaciones.dto";

export class NotificationsRouter {
  private _router: Router;
  private _notificationsController = new NotificationsController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._notificationsController.getAll.bind(this._notificationsController)
    );
    this._router.get(
      "/:uuid",
      this._notificationsController.getByUuid.bind(
        this._notificationsController
      )
    );
    this._router.post(
      "/",
      bodyValidationMiddleware(NotificationCreatedDTO),
      this._notificationsController.create.bind(this._notificationsController)
    );
    this._router.delete(
      "/:uuid",
      this._notificationsController.delete.bind(this._notificationsController)
    );
  }
  public get router(): Router {
    return this._router;
  }
}
