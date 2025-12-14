import { Router } from "express";
import { TransfersController } from "../../controllers/transfers/transfers.controller";
// import { authMiddleware } from "../../middlewares/auth.middleware";

/**
 * @openapi
 * components:
 *   schemas:
 *     ITransfer:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *           format: float
 *         currency:
 *           type: string
 *         from_user_id:
 *           type: integer
 *         to_user_id:
 *           type: integer
 *         status:
 *           type: string
 *         metadata:
 *           type: object
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         uuid: "a1b2c3d4-1234-5678-90ab-cdef12345678"
 *         amount: 150.75
 *         currency: "USD"
 *         from_user_id: 1
 *         to_user_id: 2
 *         status: "COMPLETED"
 *         metadata: {}
 *         created_at: "2025-10-01T12:00:00Z"
 */

export class TransfersRouter {
  private _router: Router;
  private _transfersController = new TransfersController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    // this._router.use(authMiddleware);
    /**
     * @openapi
     * /api/transfers:
     *   get:
     *     summary: Obtener todas las transferencias
     *     tags:
     *       - Transfers
     *     responses:
     *       "200":
     *         description: Lista de transferencias
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ITransfer'
     *             example:
     *               - uuid: "a1b2c3d4-1234-5678-90ab-cdef12345678"
     *                 amount: 150.75
     *                 currency: "USD"
     *                 from_user_id: 1
     *                 to_user_id: 2
     *                 status: "COMPLETED"
     *                 created_at: "2025-10-01T12:00:00Z"
     */
    this._router.get(
      "/",
      this._transfersController.getAll.bind(this._transfersController)
    );

    this._router.get(
      "/mine",
      this._transfersController.getAllByJwt.bind(this._transfersController)
    );
    /**
     * @openapi
     * /api/transfers/{uuid}:
     *   get:
     *     summary: Obtener transferencia por UUID
     *     tags:
     *       - Transfers
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Transferencia encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ITransfer'
     *             example:
     *               uuid: "a1b2c3d4-1234-5678-90ab-cdef12345678"
     *               amount: 150.75
     *               currency: "USD"
     *               from_user_id: 1
     *               to_user_id: 2
     *               status: "COMPLETED"
     *               created_at: "2025-10-01T12:00:00Z"
     *       "404":
     *         description: Transferencia no encontrada
     */
    this._router.get(
      "/:uuid",
      this._transfersController.getByUuid.bind(this._transfersController)
    );
    /**
     * @openapi
     * /api/transfers/{uuid}:
     *   put:
     *     summary: Actualizar una transferencia
     *     tags:
     *       - Transfers
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
     *             $ref: '#/components/schemas/ITransfer'
     *           example: {}
     *     responses:
     *       "200":
     *         description: Transferencia actualizada
     */
    this._router.put(
      "/:uuid",
      this._transfersController.update.bind(this._transfersController)
    );
    /**
     * @openapi
     * /api/transfers:
     *   post:
     *     summary: Crear una transferencia
     *     tags:
     *       - Transfers
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *           example: {}
     *     responses:
     *       "201":
     *         description: Transferencia creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ITransfer'
     */
    this._router.post(
      "/",
      this._transfersController.create.bind(this._transfersController)
    );
    /**
     * @openapi
     * /api/transfers/{uuid}:
     *   delete:
     *     summary: Eliminar una transferencia
     *     tags:
     *       - Transfers
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Transferencia eliminada
     */
    this._router.delete(
      "/:uuid",
      this._transfersController.delete.bind(this._transfersController)
    );
  }
  public get router(): Router {
    return this._router;
  }
}
