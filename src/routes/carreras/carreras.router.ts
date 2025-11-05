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
    /**
     * @openapi
     * /api/carreras/{uuid}:
     *   get:
     *     summary: Obtener carrera por UUID
     *     tags:
     *       - Carreras
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Carrera encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CarreraResponseDTO'
     *       "404":
     *         description: Carrera no encontrada
     */
    this._router.get(
      "/:uuid",
      this._carrerasController.getByUuid.bind(this._carrerasController),
    );
    /**
     * @openapi
     * /api/carreras/{uuid}:
     *   put:
     *     summary: Actualizar una carrera
     *     tags:
     *       - Carreras
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CarreraCreateDTO'
  *           example:
  *             name: "Licenciatura en Sistemas de Información"
  *             description: "Formación orientada al desarrollo de software, gestión de proyectos y análisis de sistemas."
  *             degree_title: "Licenciado en Sistemas de Información"
  *             code: "LSI"
  *             faculty: "Facultad de Ingeniería y Ciencias Aplicadas"
  *             modality: "presencial"
  *             duration_hours: 3200
  *             duration_years: 5
  *             is_active: true
  *             metadata:
  *               plan_version: "2024"
  *               coordinator: "Dra. Ana Pérez"
  *               contact_email: "info.sistemas@universidad.edu"
  *               campus:
  *                 - "Sede Central"
  *                 - "Campus Norte"
  *               observations: "Incluye prácticas profesionales y proyecto final obligatorio."
     *     responses:
     *       "200":
     *         description: Carrera actualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CarreraResponseDTO'
     *       "400":
     *         description: Datos inválidos
     *       "404":
     *         description: Carrera no encontrada
     */
    this._router.put(
      "/:uuid",
      this._carrerasController.update.bind(this._carrerasController),
    );
    /**
     * @openapi
     * /api/carreras:
     *   post:
     *     summary: Crear una nueva carrera
     *     tags:
     *       - Carreras
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CarreraCreateDTO'
      *           example:
      *             name: "Licenciatura en Sistemas de Información"
      *             description: "Formación orientada al desarrollo de software, gestión de proyectos y análisis de sistemas."
      *             degree_title: "Licenciado en Sistemas de Información"
      *             code: "LSI"
      *             faculty: "Facultad de Ingeniería y Ciencias Aplicadas"
      *             modality: "presencial"
      *             duration_hours: 3200
      *             duration_years: 5
      *             is_active: true
      *             metadata:
      *               plan_version: "2024"
      *               coordinator: "Dra. Ana Pérez"
      *               contact_email: "info.sistemas@universidad.edu"
      *               campus:
      *                 - "Sede Central"
      *                 - "Campus Norte"
      *               observations: "Incluye prácticas profesionales y proyecto final obligatorio."
     *     responses:
     *       "201":
     *         description: Carrera creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CarreraResponseDTO'
     *       "400":
     *         description: Datos inválidos
     */
    this._router.post(
      "/",
      bodyValidationMiddleware(CarreraCreateDTO),
      this._carrerasController.create.bind(this._carrerasController),
    );
    /**
     * @openapi
     * /api/carreras/{uuid}:
     *   delete:
     *     summary: Eliminar una carrera
     *     tags:
     *       - Carreras
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Carrera eliminada
     *       "404":
     *         description: Carrera no encontrada
     */
    this._router.delete(
      "/:uuid",
      this._carrerasController.delete.bind(this._carrerasController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
