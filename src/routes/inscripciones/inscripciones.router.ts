import { Router } from "express";
import { InscripcionesController } from "../../controllers/inscripciones/inscripciones.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { ToIInscripcionesDTO } from "../../common/dto/inscripciones/inscriopciones.interface.dto";

export class InscripcionesRouter {
  private _router: Router;
  private _inscripcionesController = new InscripcionesController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._inscripcionesController.getAll.bind(this._inscripcionesController)
    );
    this._router.get(
      "/:uuid",
      this._inscripcionesController.getByUuid.bind(
        this._inscripcionesController
      )
    );
    this._router.put(
      "/:uuid",
      bodyValidationMiddleware(ToIInscripcionesDTO),
      this._inscripcionesController.update.bind(this._inscripcionesController)
    );
    this._router.post(
      "/",
      bodyValidationMiddleware(ToIInscripcionesDTO),
      this._inscripcionesController.create.bind(this._inscripcionesController)
    );
    this._router.delete(
      "/:uuid",
      this._inscripcionesController.delete.bind(this._inscripcionesController)
    );
  }
  public get router(): Router {
    return this._router;
  }
}
