import { Router } from "express";
import { MateriasController } from "../../controllers/materias/materias.controller";
import { CorrelativaCreateDTO } from "../../common/dto/correlativa.dto";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { MateriaCreateDTO } from "../../common/dto/materia/create.materia.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     IMateria:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         nombre:
 *           type: string
 *         uuid_carrera:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 *         approval_method:
 *           type: string
 *         is_elective:
 *           type: boolean
 *         correlativas:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         metadata:
 *           type: object
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         uuid: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
 *         nombre: "Diseño de apps 1"
 *         uuid_carrera: "fbce2c13-b50c-4b2e-9902-cceb4a6e83f2"
 *         description: "Introducción al modelado de datos, SQL y normalización."
 *         approval_method: "final"
 *         is_elective: false
 *         correlativas:
 *           - "afa80fd1-71e2-4ff0-b595-4ce0c7bb2f9c"
 *           - "c46e168b-3f61-4fe6-8c95-31333f66f72f"
 *         metadata:
 *           profesor: "Mg. Juan Martínez"
 *           horario: "Martes y Jueves 18:00–20:30"
 *           modalidad: "presencial"
 *           aula: "Laboratorio 2"
 *           requisitos:
 *             - "Programación I"
 *           observaciones: "Incluye prácticas con PostgreSQL y modelado ER."
 */

export class MateriasRouter {
  private _router: Router;
  private _materiasController = new MateriasController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    // Rutas de correlativas (van antes de las rutas generales para evitar conflictos)
    /**
     * @openapi
     * /api/materias/{uuid}/correlativas:
     *   get:
     *     summary: Obtener las correlativas de una materia
     *     tags:
     *       - Materias
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Lista de UUIDs de materias correlativas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *                 format: uuid
     *             example:
     *               - "7d68a3d8-2c67-486a-b06a-51c8781a2da7"
     */
    this._router.get(
      "/:uuid/correlativas",
      this._materiasController.getCorrelativas.bind(this._materiasController),
    );
    /**
     * @openapi
     * /api/materias/{uuid}/correlativas:
     *   post:
     *     summary: Agregar una correlativa a la materia
     *     tags:
     *       - Materias
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
     *             type: object
     *             properties:
     *               uuid_materia_correlativa:
     *                 type: string
     *                 format: uuid
     *           example:
     *             uuid_materia_correlativa: "a4e49bdc-cf7b-4fea-ae1c-15f456958140"
     *     responses:
     *       "201":
     *         description: Correlativa agregada
     */
    this._router.post(
      "/:uuid/correlativas",
      bodyValidationMiddleware(CorrelativaCreateDTO),
      this._materiasController.addCorrelativa.bind(this._materiasController),
    );
    /**
     * @openapi
     * /api/materias/{uuid}/correlativas/{uuidCorrelativa}:
     *   delete:
     *     summary: Eliminar una correlativa de la materia
     *     tags:
     *       - Materias
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: path
     *         name: uuidCorrelativa
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Correlativa eliminada
     */
    this._router.delete(
      "/:uuid/correlativas/:uuidCorrelativa",
      this._materiasController.removeCorrelativa.bind(this._materiasController),
    );

    // Rutas principales de materias
    /**
     * @openapi
     * /api/materias:
     *   get:
     *     summary: Obtener todas las materias
     *     tags:
     *       - Materias
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
     *     responses:
     *       "200":
     *         description: Lista paginada de materias
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
     *                     $ref: '#/components/schemas/IMateria'
     *             example:
     *               page: 1
     *               limit: 20
     *               total: 1
     *               items:
     *                 - uuid: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
     *                   nombre: "Diseño de apps 1"
     *                   uuid_carrera: "fbce2c13-b50c-4b2e-9902-cceb4a6e83f2"
     *                   description: "Introducción al modelado de datos, SQL y normalización."
     *                   approval_method: "final"
     *                   is_elective: false
     *                   correlativas:
     *                     - "afa80fd1-71e2-4ff0-b595-4ce0c7bb2f9c"
     *                     - "c46e168b-3f61-4fe6-8c95-31333f66f72f"
     */
    this._router.get(
      "/",
      this._materiasController.getAll.bind(this._materiasController),
    );
    /**
     * @openapi
     * /api/materias/{uuid}:
     *   get:
     *     summary: Obtener materia por UUID
     *     tags:
     *       - Materias
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Materia encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/IMateria'
     *             example:
     *               uuid: "d9c4c3eb-c5a8-46df-a50e-0b949a2a1e7a"
     *               nombre: "Diseño de apps 1"
     *               uuid_carrera: "fbce2c13-b50c-4b2e-9902-cceb4a6e83f2"
     *               description: "Introducción al modelado de datos, SQL y normalización."
     *               approval_method: "final"
     *               is_elective: false
     *               correlativas:
     *                 - "afa80fd1-71e2-4ff0-b595-4ce0c7bb2f9c"
     *                 - "c46e168b-3f61-4fe6-8c95-31333f66f72f"
     */
    this._router.get(
      "/:uuid",
      this._materiasController.getByUuid.bind(this._materiasController),
    );

    // Rutas de modificación de materias
    /**
     * @openapi
     * /api/materias/{uuid}:
     *   put:
     *     summary: Actualizar materia
     *     tags:
     *       - Materias
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
     *             $ref: '#/components/schemas/IMateria'
     *           example:
     *             nombre: "Diseño de apps 1 - Actualizada"
     *             description: "Descripción actualizada"
     *             approval_method: "final"
     *             is_elective: false
     *             metadata:
     *               profesor: "Mg. Juan Martínez"
     *     responses:
     *       "200":
     *         description: Materia actualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/IMateria'
     */
    this._router.put(
      "/:uuid",
      this._materiasController.update.bind(this._materiasController),
    );
    /**
     * @openapi
     * /api/materias:
     *   post:
     *     summary: Crear una nueva materia
     *     tags:
     *       - Materias
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nombre:
     *                 type: string
     *               uuid_carrera:
     *                 type: string
     *                 format: uuid
     *               description:
     *                 type: string
     *               approval_method:
     *                 type: string
     *               is_elective:
     *                 type: boolean
     *               correlativas:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: uuid
     *               metadata:
     *                 type: object
     *           example:
     *             nombre: "Diseño de apps 1"
     *             uuid_carrera: "fbce2c13-b50c-4b2e-9902-cceb4a6e83f2"
     *             description: "Introducción al modelado de datos, SQL y normalización."
     *             approval_method: "final"
     *             is_elective: false
     *             correlativas:
     *               - "afa80fd1-71e2-4ff0-b595-4ce0c7bb2f9c"
     *               - "c46e168b-3f61-4fe6-8c95-31333f66f72f"
     *             metadata:
     *               profesor: "Mg. Juan Martínez"
     *               horario: "Martes y Jueves 18:00–20:30"
     *               modalidad: "presencial"
     *               aula: "Laboratorio 2"
     *               requisitos:
     *                 - "Programación I"
     *               observaciones: "Incluye prácticas con PostgreSQL y modelado ER."
     *     responses:
     *       "201":
     *         description: Materia creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/IMateria'
     */
    this._router.post(
      "/",
      bodyValidationMiddleware(MateriaCreateDTO),
      this._materiasController.create.bind(this._materiasController),
    );
    /**
     * @openapi
     * /api/materias/{uuid}:
     *   delete:
     *     summary: Eliminar una materia
     *     tags:
     *       - Materias
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Materia eliminada
     *       "404":
     *         description: Materia no encontrada
     */
    this._router.delete(
      "/:uuid",
      this._materiasController.delete.bind(this._materiasController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
