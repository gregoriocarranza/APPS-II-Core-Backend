import { Router } from "express";
import { CalendarEventsController } from "../../controllers/calendar-events/calendar-events.controller";

/**
 * @openapi
 * components:
 *   schemas:
 *     ICalendarEvent:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         metadata:
 *           type: object
 *         status:
 *           type: string
 *         start_at:
 *           type: string
 *           format: date-time
 *         end_at:
 *           type: string
 *           format: date-time
 *         user_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         uuid: "fcfa9cde-75bd-4b4e-a4e1-8183d50257b6"
 *         title: "Examen Final de Programación"
 *         description: "Examen final teórico-práctico"
 *         type: "EXAMEN"
 *         metadata: {}
 *         status: "SCHEDULED"
 *         start_at: "2025-12-15T09:00:00Z"
 *         end_at: "2025-12-15T12:00:00Z"
 *         user_id: 1
 *         created_at: "2025-10-01T12:00:00Z"
 */

export class CalendarEventsRouter {
  private _router: Router;
  private _calendarEventsController = new CalendarEventsController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    /**
     * @openapi
     * /api/calendar-events:
     *   get:
     *     summary: Obtener todos los eventos de calendario
     *     tags:
     *       - CalendarEvents
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
     *         name: userId
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Lista paginada de eventos
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
     *                     type: object
     *                     properties:
     *                       uuid:
     *                         type: string
     *                         format: uuid
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
     *                       type:
     *                         type: string
     *                       start_at:
     *                         type: string
     *                         format: date-time
     *                       end_at:
     *                         type: string
     *                         format: date-time
     *                       user_id:
     *                         type: integer
     *               required: [page, limit, total, items]
     *             example:
     *               page: 1
     *               limit: 20
     *               total: 1
     *               items:
     *                 - uuid: "fcfa9cde-75bd-4b4e-a4e1-8183d50257b6"
     *                   title: "Examen Final de Programación"
     *                   description: "Examen final teórico-práctico"
     *                   type: "EXAMEN"
     *                   start_at: "2025-12-15T09:00:00Z"
     *                   end_at: "2025-12-15T12:00:00Z"
     *                   user_id: 1
     */
    this._router.get(
      "/",
      this._calendarEventsController.getAll.bind(
        this._calendarEventsController,
      ),
    );
    /**
     * @openapi
     * /api/calendar-events/{uuid}:
     *   get:
     *     summary: Obtener evento por UUID
     *     tags:
     *       - CalendarEvents
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Evento encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 uuid:
     *                   type: string
     *                   format: uuid
     *                 title:
     *                   type: string
     *                 description:
     *                   type: string
     *                 type:
     *                   type: string
     *                 start_at:
     *                   type: string
     *                   format: date-time
     *                 end_at:
     *                   type: string
     *                   format: date-time
     *                 user_id:
     *                   type: integer
     *             example:
     *               uuid: "fcfa9cde-75bd-4b4e-a4e1-8183d50257b6"
     *               title: "Examen Final de Programación"
     *               description: "Examen final teórico-práctico"
     *               type: "EXAMEN"
     *               start_at: "2025-12-15T09:00:00Z"
     *               end_at: "2025-12-15T12:00:00Z"
     *               user_id: 1
     *       "404":
     *         description: Evento no encontrado
     */
    this._router.get(
      "/:uuid",
      this._calendarEventsController.getByUuid.bind(
        this._calendarEventsController,
      ),
    );
    /**
     * @openapi
     * /api/calendar-events/{uuid}:
     *   put:
     *     summary: Actualizar evento de calendario
     *     tags:
     *       - CalendarEvents
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
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               type:
     *                 type: string
     *               location:
     *                 type: string
     *               capacity:
     *                 type: integer
     *               start_at:
     *                 type: string
     *                 format: date-time
     *               end_at:
     *                 type: string
     *                 format: date-time
     *           example:
     *             title: "Examen Final Actualizado"
     *             description: "Descripción actualizada"
     *             type: "EXAMEN"
     *             location: "Aula 305"
     *             capacity: 50
     *             start_at: "2025-12-15T09:00:00Z"
     *             end_at: "2025-12-15T12:00:00Z"
     *     responses:
     *       "200":
     *         description: Evento actualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ICalendarEvent'
     *       "400":
     *         description: Datos inválidos
     *       "404":
     *         description: Evento no encontrado
     */
    this._router.put(
      "/:uuid",
      this._calendarEventsController.update.bind(
        this._calendarEventsController,
      ),
    );
    /**
     * @openapi
     * /api/calendar-events:
     *   post:
     *     summary: Crear un nuevo evento de calendario
     *     tags:
     *       - CalendarEvents
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               type:
     *                 type: string
     *               start_at:
     *                 type: string
     *                 format: date-time
     *               end_at:
     *                 type: string
     *                 format: date-time
     *               user_id:
     *                 type: integer
     *           example:
     *             title: "Examen Final de Programación"
     *             description: "Examen final teórico-práctico"
     *             type: "EXAMEN"
     *             start_at: "2025-12-15T09:00:00Z"
     *             end_at: "2025-12-15T12:00:00Z"
     *             user_id: 1
     *     responses:
     *       "201":
     *         description: Evento creado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ICalendarEvent'
     *       "400":
     *         description: Datos inválidos
     */
    this._router.post(
      "/",
      this._calendarEventsController.create.bind(
        this._calendarEventsController,
      ),
    );
    /**
     * @openapi
     * /api/calendar-events/{uuid}:
     *   delete:
     *     summary: Eliminar un evento de calendario
     *     tags:
     *       - CalendarEvents
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Evento eliminado
     *       "404":
     *         description: Evento no encontrado
     */
    this._router.delete(
      "/:uuid",
      this._calendarEventsController.delete.bind(
        this._calendarEventsController,
      ),
    );
  }

  public get router(): Router {
    return this._router;
  }
}
