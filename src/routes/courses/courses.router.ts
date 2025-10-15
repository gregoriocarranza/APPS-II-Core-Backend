import { Router } from "express";
import { CoursesController } from "../../controllers/courses/courses.controller";

export class CoursesRouter {
  private _router: Router;
  private _coursesController = new CoursesController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      "/",
      this._coursesController.getAll.bind(this._coursesController)
    );
    this._router.get(
      "/:uuid",
      this._coursesController.getByUuid.bind(this._coursesController)
    );
    this._router.put(
      "/:uuid",
      this._coursesController.update.bind(this._coursesController)
    );
    this._router.post(
      "/",
      this._coursesController.create.bind(this._coursesController)
    );
    this._router.delete(
      "/:uuid",
      this._coursesController.delete.bind(this._coursesController)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
