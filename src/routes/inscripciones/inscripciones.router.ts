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
    /**
     * @openapi
     * /api/inscripciones:
     *   get:
     *     summary: Obtener inscripciones (filtrable por uuid_curso o user_uuid)
     *     tags:
     *       - Inscripciones
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 20
     *       - in: query
     *         name: uuid_curso
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: query
     *         name: user_uuid
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Lista paginada de inscripciones
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *                 total:
     *                   type: integer
     *                 items:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ToIInscripcionesDTO'
     */
    this._router.get(
      "/",
      this._inscripcionesController.getAll.bind(this._inscripcionesController),
    );

    /**
     * @openapi
     * /api/inscripciones/{uuid}:
     *   get:
     *     summary: Obtener inscripción por UUID
     *     tags:
     *       - Inscripciones
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Inscripción encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ToIInscripcionesDTO'
     *       "404":
     *         description: Inscripción no encontrada
     */
    this._router.get(
      "/:uuid",
      this._inscripcionesController.getByUuid.bind(this._inscripcionesController),
    );

    /**
     * @openapi
     * /api/inscripciones:
     *   post:
     *     summary: Crear una nueva inscripción
     *     tags:
     *       - Inscripciones
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ToIInscripcionesDTO'
     *           example:
     *             uuid_curso: "c050c197-266d-4e61-881e-a5a5cd388758"
     *             user_uuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
     *             estado: "pendiente"
     *             rol: "ALUMNO"
     *     responses:
     *       "201":
     *         description: Inscripción creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ToIInscripcionesDTO'
     *       "400":
     *         description: Datos inválidos
     */
    this._router.post(
      "/",
      bodyValidationMiddleware(ToIInscripcionesDTO),
      this._inscripcionesController.create.bind(this._inscripcionesController),
    );

    /**
     * @openapi
     * /api/inscripciones/{uuid}:
     *   put:
     *     summary: Actualizar una inscripción
     *     tags:
     *       - Inscripciones
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
     *             $ref: '#/components/schemas/ToIInscripcionesDTO'
     *           example:
     *             uuid_curso: "c050c197-266d-4e61-881e-a5a5cd388758"
     *             user_uuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
     *             estado: "aprobado"
     *             rol: "ALUMNO"
     *     responses:
     *       "200":
     *         description: Inscripción actualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ToIInscripcionesDTO'
     *       "400":
     *         description: Datos inválidos
     *       "404":
     *         description: Inscripción no encontrada
     */
    this._router.put(
      "/:uuid",
      bodyValidationMiddleware(ToIInscripcionesDTO),
      this._inscripcionesController.update.bind(this._inscripcionesController),
    );

    /**
     * @openapi
     * /api/inscripciones/{uuid}:
     *   delete:
     *     summary: Eliminar una inscripción
     *     tags:
     *       - Inscripciones
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Inscripción eliminada
     *       "404":
     *         description: Inscripción no encontrada
     */
    this._router.delete(
      "/:uuid",
      this._inscripcionesController.delete.bind(this._inscripcionesController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
