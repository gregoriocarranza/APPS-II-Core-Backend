import { Router } from "express";
import { CarrerasController } from "../../controllers/carreras/carreras.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { CarreraCreateDTO } from "../../common/dto/carrera/carrera.materia.dto";

export class CarrerasRouter {
  private _router: Router;
  private _carrerasController = new CarrerasController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._carrerasController.getAll.bind(this._carrerasController),
    );
    this._router.get(
      "/:uuid",
      this._carrerasController.getByUuid.bind(this._carrerasController),
    );
    this._router.put(
      "/:uuid",
      this._carrerasController.update.bind(this._carrerasController),
    );
    this._router.post(
      "/",
      bodyValidationMiddleware(CarreraCreateDTO),
      this._carrerasController.create.bind(this._carrerasController),
    );
    this._router.delete(
      "/:uuid",
      this._carrerasController.delete.bind(this._carrerasController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
