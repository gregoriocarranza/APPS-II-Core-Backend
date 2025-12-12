import { Router } from "express";
import { WalletsController } from "../../controllers/wallets/wallets.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { WalletCreatedDTO } from "../../common/dto/wallet.dto";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { administratorMiddleware } from "../../middlewares/administrator.middleware";

/**
 * @openapi
 * components:
 *   schemas:
 *     IWallet:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         user_uuid:
 *           type: string
 *           format: uuid
 *         balance:
 *           type: number
 *           format: float
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *         metadata:
 *           type: object
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         uuid: "ad2fb281-0474-4b55-aed8-73308292e3d5"
 *         user_uuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
 *         balance: 100.5
 *         currency: "USD"
 *         status: "ACTIVE"
 *         created_at: "2025-10-01T12:00:00Z"
 */

export class WalletsRouter {
  private _router: Router;
  private _walletsController = new WalletsController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.use(authMiddleware);
    /**
     * @openapi
     * /api/wallets:
     *   get:
     *     summary: Obtener todas las wallets (filtrable por user_uuid)
     *     tags:
     *       - Wallets
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
     *         name: user_uuid
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Lista paginada de wallets
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
     *                     $ref: '#/components/schemas/IWallet'
     *             example:
     *               page: 1
     *               limit: 2
     *               total: 1
     *               items:
     *                 - uuid: "ad2fb281-0474-4b55-aed8-73308292e3d5"
     *                   user_uuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
     *                   balance: 100.5
     *                   currency: "USD"
     */
    this._router.get(
      "/",
      administratorMiddleware,
      this._walletsController.getAll.bind(this._walletsController)
    );
    this._router.get(
      "/mine",
      this._walletsController.getByJwt.bind(this._walletsController)
    );
    /**
     * @openapi
     * /api/wallets/{uuid}:
     *   get:
     *     summary: Obtener wallet por UUID
     *     tags:
     *       - Wallets
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "200":
     *         description: Wallet encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/IWallet'
     *             example:
     *               uuid: "ad2fb281-0474-4b55-aed8-73308292e3d5"
     *               user_uuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
     *               balance: 100.5
     *               currency: "USD"
     */
    this._router.get(
      "/:uuid",
      administratorMiddleware,
      this._walletsController.getByUuid.bind(this._walletsController)
    );
    /**
     * @openapi
     * /api/wallets/{uuid}:
     *   put:
     *     summary: Actualizar wallet
     *     tags:
     *       - Wallets
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
     *             $ref: '#/components/schemas/IWallet'
     *           example: {}
     *     responses:
     *       "200":
     *         description: Wallet actualizada
     */
    this._router.put(
      "/:uuid",
      administratorMiddleware,
      this._walletsController.update.bind(this._walletsController)
    );
    /**
     * @openapi
     * /api/wallets:
     *   post:
     *     summary: Crear wallet
     *     tags:
     *       - Wallets
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_uuid:
     *                 type: string
     *                 format: uuid
     *               currency:
     *                 type: string
     *           example:
     *             user_uuid: "9f5c953b-1ab4-46b7-8b3e-26cf59101471"
     *             currency: "USD"
     *     responses:
     *       "201":
     *         description: Wallet creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/IWallet'
     */
    this._router.post(
      "/",
      administratorMiddleware,
      bodyValidationMiddleware(WalletCreatedDTO),
      this._walletsController.create.bind(this._walletsController)
    );
    /**
     * @openapi
     * /api/wallets/{uuid}:
     *   delete:
     *     summary: Eliminar wallet
     *     tags:
     *       - Wallets
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       "204":
     *         description: Wallet eliminada
     */
    this._router.delete(
      "/:uuid",
      administratorMiddleware,
      this._walletsController.delete.bind(this._walletsController)
    );
  }
  public get router(): Router {
    return this._router;
  }
}
