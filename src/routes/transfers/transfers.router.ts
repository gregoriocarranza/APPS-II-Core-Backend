import { Router } from "express";
import { TransfersController } from "../../controllers/transfers/transfers.controller";

export class TransfersRouter {
  private _router: Router;
  private _transfersController = new TransfersController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._transfersController.getAll.bind(this._transfersController),
    );
    this._router.get(
      "/:uuid",
      this._transfersController.getByUuid.bind(this._transfersController),
    );
    this._router.put(
      "/:uuid",
      this._transfersController.update.bind(this._transfersController),
    );
    this._router.post(
      "/",
      this._transfersController.create.bind(this._transfersController),
    );
    this._router.delete(
      "/:uuid",
      this._transfersController.delete.bind(this._transfersController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
