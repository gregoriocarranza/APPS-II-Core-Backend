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
  /**
   * @openapi
   * /api/carreras:
   *   get:
   *     summary: Obtener todas las carreras
   *     tags:
   *       - Carreras
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Numero de pagina
   *       - in: query
   *         name: page_size
   *         schema:
   *           type: integer
   *           default: 25
   *         description: Tamaño de pagina
   *     responses:
   *       "200":
   *         description: Lista paginada de carreras
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 page:
   *                   type: integer
   *                 page_size:
   *                   type: integer
   *                 total:
   *                   type: integer
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CarreraResponseDTO'
   *               required: [page, page_size, total, items]
   */
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
