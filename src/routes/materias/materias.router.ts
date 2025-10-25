import { Router } from "express";
import { MateriasController } from "../../controllers/materias/materias.controller";
import { MateriaCreateDTO } from "../../common/dto/materia.dto";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";

export class MateriasRouter {
  private _router: Router;
  private _materiasController = new MateriasController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._materiasController.getAll.bind(this._materiasController),
    );
    this._router.get(
      "/:uuid",
      this._materiasController.getByUuid.bind(this._materiasController),
    );
    this._router.put(
      "/:uuid",
      this._materiasController.update.bind(this._materiasController),
    );
    this._router.post(
      "/",
      bodyValidationMiddleware(MateriaCreateDTO),
      this._materiasController.create.bind(this._materiasController),
    );
    this._router.delete(
      "/:uuid",
      this._materiasController.delete.bind(this._materiasController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
