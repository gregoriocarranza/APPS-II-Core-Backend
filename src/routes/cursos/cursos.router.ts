import { Router } from "express";
import { CursosController } from "../../controllers/cursos/cursos.controller";

export class CursosRouter {
  private _router: Router;
  private _cursosController = new CursosController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._cursosController.getAll.bind(this._cursosController),
    );
    this._router.get(
      "/:uuid",
      this._cursosController.getByUuid.bind(this._cursosController),
    );
    this._router.put(
      "/:uuid",
      this._cursosController.update.bind(this._cursosController),
    );
    this._router.post(
      "/",
      this._cursosController.create.bind(this._cursosController),
    );
    this._router.delete(
      "/:uuid",
      this._cursosController.delete.bind(this._cursosController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
