import { Router } from "express";
import { CursosController } from "../../controllers/cursos/cursos.controller";

import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { CursoCreateDTO } from "../../common/dto/curso/create.curso.dto";
import { authMiddleware } from "../../middlewares/auth.middleware";

/**
 * @openapi
 * components:
 *   schemas:
 *     ICurso:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         uuid_materia:
 *           type: string
 *           format: uuid
 *         examen:
 *           type: string
 *         comision:
 *           type: string
 *         modalidad:
 *           type: string
 *         sede:
 *           type: string
 *         aula:
 *           type: string
 *         periodo:
 *           type: string
 *         turno:
 *           type: string
 *         estado:
 *           type: string
 *         cantidad_max:
 *           type: integer
 *         cantidad_min:
 *           type: integer
 *         desde:
 *           type: string
 *           format: date-time
 *         hasta:
 *           type: string
 *           format: date-time
 *       example:
 *         uuid: "c050c197-266d-4e61-881e-a5a5cd388758"
 *         uuid_materia: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
 *         examen: "Final integrador"
 *         comision: "B"
 *         modalidad: "PRESENCIAL"
 *         sede: "Campus Central"
 *         aula: "Aula 204"
 *         periodo: "1er Cuatrimestre 2025"
 *         turno: "Mañana"
 *         estado: "activo"
 *         cantidad_max: 35
 *         cantidad_min: 10
 *         desde: "2025-03-10T08:00:00Z"
 *         hasta: "2025-07-20T12:00:00Z"
 */

export class CursosRouter {
  private _router: Router;
  private _cursosController = new CursosController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.use(authMiddleware);
    /**
     * @openapi
     * /api/cursos:
     *   get:
     *     summary: Obtener todos los cursos
     *     tags:
     *       - Cursos
     *     responses:
     *       "200":
     *         description: Lista de cursos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ICurso'
     *             example:
     *               - uuid: "c050c197-266d-4e61-881e-a5a5cd388758"
     *                 uuid_materia: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
     *                 examen: "Final integrador"
     *                 comision: "B"
     *                 modalidad: "PRESENCIAL"
     *                 sede: "Campus Central"
     *                 aula: "Aula 204"
     *                 periodo: "1er Cuatrimestre 2025"
     *                 turno: "Mañana"
     *                 estado: "activo"
     *                 cantidad_max: 35
     *                 cantidad_min: 10
     *                 desde: "2025-03-10T08:00:00Z"
     *                 hasta: "2025-07-20T12:00:00Z"
     */
    this._router.get(
      "/",
      this._cursosController.getAll.bind(this._cursosController)
    );
    /**
     * @openapi
     * /api/cursos/{uuid}:
     *   get:
     *     summary: Obtener curso por UUID
     *     tags:
     *       - Cursos
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Curso encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ICurso'
     *             example:
     *               uuid: "c050c197-266d-4e61-881e-a5a5cd388758"
     *               uuid_materia: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
     *               examen: "Final integrador"
     *               comision: "B"
     *               modalidad: "PRESENCIAL"
     *               sede: "Campus Central"
     *               aula: "Aula 204"
     *               periodo: "1er Cuatrimestre 2025"
     *               turno: "Mañana"
     *               estado: "activo"
     *               cantidad_max: 35
     *               cantidad_min: 10
     *               desde: "2025-03-10T08:00:00Z"
     *               hasta: "2025-07-20T12:00:00Z"
     */
    this._router.get(
      "/:uuid",
      this._cursosController.getByUuid.bind(this._cursosController)
    );
    /**
     * @openapi
     * /api/cursos/{uuid}:
     *   put:
     *     summary: Actualizar curso
     *     tags:
     *       - Cursos
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
     *             $ref: '#/components/schemas/ICurso'
     *           example: {}
     *     responses:
     *       "200":
     *         description: Curso actualizado
     */
    this._router.put(
      "/:uuid",
      this._cursosController.update.bind(this._cursosController)
    );
    /**
     * @openapi
     * /api/cursos:
     *   post:
     *     summary: Crear un nuevo curso
     *     tags:
     *       - Cursos
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               uuid_materia:
     *                 type: string
     *                 format: uuid
     *               examen:
     *                 type: string
     *               comision:
     *                 type: string
     *               modalidad:
     *                 type: string
     *               sede:
     *                 type: string
     *               aula:
     *                 type: string
     *               periodo:
     *                 type: string
     *               turno:
     *                 type: string
     *               estado:
     *                 type: string
     *               cantidad_max:
     *                 type: integer
     *               cantidad_min:
     *                 type: integer
     *               desde:
     *                 type: string
     *                 format: date-time
     *               hasta:
     *                 type: string
     *                 format: date-time
     *           example:
     *             uuid_materia: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
     *             examen: "Final integrador"
     *             comision: "B"
     *             modalidad: "PRESENCIAL"
     *             sede: "Campus Central"
     *             aula: "Aula 204"
     *             periodo: "1er Cuatrimestre 2025"
     *             turno: "Mañana"
     *             estado: "activo"
     *             cantidad_max: 35
     *             cantidad_min: 10
     *             desde: "2025-03-10T08:00:00Z"
     *             hasta: "2025-07-20T12:00:00Z"
     *     responses:
     *       "201":
     *         description: Curso creado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ICurso'
     */
    this._router.post(
      "/",
      bodyValidationMiddleware(CursoCreateDTO),
      this._cursosController.create.bind(this._cursosController)
    );
    /**
     * @openapi
     * /api/cursos/{uuid}:
     *   delete:
     *     summary: Eliminar un curso
     *     tags:
     *       - Cursos
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Curso eliminado
     */
    this._router.delete(
      "/:uuid",
      this._cursosController.delete.bind(this._cursosController)
    );
  }
  public get router(): Router {
    return this._router;
  }
}
