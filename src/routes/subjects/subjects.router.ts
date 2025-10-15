import { Router } from "express";
import { SubjectsController } from "../../controllers/subjects/subjects.controller";

export class SubjectsRouter {
  private _router: Router;
  private _subjectsController = new SubjectsController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      "/",
      this._subjectsController.getAll.bind(this._subjectsController)
    );
    this._router.get(
      "/:uuid",
      this._subjectsController.getByUuid.bind(this._subjectsController)
    );
    this._router.put(
      "/:uuid",
      this._subjectsController.update.bind(this._subjectsController)
    );
    this._router.post(
      "/",
      this._subjectsController.create.bind(this._subjectsController)
    );
    this._router.delete(
      "/:uuid",
      this._subjectsController.delete.bind(this._subjectsController)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
