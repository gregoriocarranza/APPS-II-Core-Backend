import { Router } from "express";
import { NotificationsController } from "../../controllers/notifications/notifications.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { NotificationCreatedByTypeDTO } from "../../common/dto/notificaciones/create.notificaciones.dto";
import { authMiddleware } from "../../middlewares/auth.middleware";

/**
 * @openapi
 * components:
 *   schemas:
 *     INotification:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         user_uuid:
 *           type: string
 *         userUuid:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         bodyType:
 *           type: string
 *         body:
 *           type: string
 *         EmailType:
 *           type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               href:
 *                 type: string
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         uuid: "88ef822d-1feb-47ce-9c6e-5db9558e6d13"
 *         user_uuid: 88ef822d-1feb-47ce-9c6e-5db9558easdasd
 *         userUuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
 *         title: "Nueva notificación del sistema"
 *         bodyType: "html"
 *         body: "<p>Hola! Tu solicitud fue <strong>aprobada</strong>.</p>"
 *         EmailType: "HEALTH"
 *         attachments:
 *           - filename: "license.txt"
 *             href: "https://raw.githubusercontent.com/nodemailer/nodemailer/master/LICENSE"
 */

export class NotificationsRouter {
  private _router: Router;
  private _notificationsController = new NotificationsController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.use(authMiddleware);
    /**
     * @openapi
     * /api/notifications:
     *   get:
     *     summary: Obtener notificaciones (filtrar por user_id)
     *     tags:
     *       - Notifications
     *     parameters:
     *       - in: query
     *         name: user_id
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Lista de notificaciones
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/INotification'
     */
    this._router.get(
      "/",
      this._notificationsController.getAll.bind(this._notificationsController)
    );
    /**
     * @openapi
     * /api/notifications/{uuid}:
     *   get:
     *     summary: Obtener notificación por UUID
     *     tags:
     *       - Notifications
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Notificación encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/INotification'
     *             example:
     *               uuid: "88ef822d-1feb-47ce-9c6e-5db9558e6d13"
     *               user_id: 1
     *               title: "Nueva notificación del sistema"
     *               bodyType: "html"
     *               body: "<p>Hola! Tu solicitud fue <strong>aprobada</strong>. Podés verla en tu perfil.</p>"
     */
    this._router.get(
      "/:uuid",
      this._notificationsController.getByUuid.bind(
        this._notificationsController
      )
    );
    /**
     * @openapi
     * /api/notifications:
     *   post:
     *     summary: Crear una notificación (por template/EmailType)
     *     tags:
     *       - Notifications
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userUuid:
     *                 type: string
     *                 format: uuid
     *               EmailType:
     *                 type: string
     *           example:
     *             userUuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
     *             EmailType: "HEALTH"
     *     responses:
     *       "201":
     *         description: Notificación creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/INotification'
     */
    this._router.post(
      "/",
      bodyValidationMiddleware(NotificationCreatedByTypeDTO),
      this._notificationsController.create.bind(this._notificationsController)
    );
    this._router.put(
      "/:uuid/status",
      this._notificationsController.changeStatus.bind(this._notificationsController)
    );
    /**
     * @openapi
     * /api/notifications/{uuid}:
     *   delete:
     *     summary: Eliminar una notificación
     *     tags:
     *       - Notifications
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Notificación eliminada
     */
    this._router.delete(
      "/:uuid",
      this._notificationsController.delete.bind(this._notificationsController)
    );
  }
  public get router(): Router {
    return this._router;
  }
}
