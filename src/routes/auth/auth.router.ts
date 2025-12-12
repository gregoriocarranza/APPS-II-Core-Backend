import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { LoginDTO, VerifyJwtDTO } from "../../common/dto/auth.dto";
import { authMiddleware } from "../../middlewares/auth.middleware";

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       example:
 *         email: "gregoriocarranza@hotmail.com"
 *         password: "1234"
 *     RefreshRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *       example:
 *         refreshToken: "a@b.com"
 *     AuthTokens:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         access_token:
 *           type: string
 *         refresh_token:
 *           type: string
 *         token_type:
 *           type: string
 *         expires_in:
 *           type: integer
 *       example:
 *         success: true
 *         access_token: "eyJhbGciOi..."
 *         refresh_token: "refresh-token-value"
 *         token_type: "Bearer"
 *         expires_in: 3600
 *     VerifyRequest:
 *       type: object
 *       properties:
 *         kind:
 *           type: string
 *         token:
 *           type: string
 *       example:
 *         kind: "access"
 *         token: "eyJhbGciOi..."
 *     VerifyResponseSuccess:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *         kind:
 *           type: string
 *       example:
 *         valid: true
 *         kind: "access"
 *     VerifyResponseFailure:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *         kind:
 *           type: string
 *         reason:
 *           type: string
 *       example:
 *         valid: false
 *         kind: "access"
 *         reason: "Token inválido o expirado"
 */

export class AuthRouter {
  private _router: Router;
  private _authController = new AuthController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    /**
     * @openapi
     * /api/auth/login:
     *   post:
     *     summary: Iniciar sesión y obtener tokens
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       "200":
     *         description: Tokens de autenticación
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthTokens'
     */
    this._router.post(
      "/login",
      bodyValidationMiddleware(LoginDTO),
      this._authController.login.bind(this._authController)
    );
    /**
     * @openapi
     * /api/auth/refresh:
     *   post:
     *     summary: Rotar el refresh token y obtener un nuevo access token
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RefreshRequest'
     *     responses:
     *       "200":
     *         description: Nuevo access token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthTokens'
     */
    this._router.post(
      "/refresh",
      authMiddleware,
      this._authController.refresh.bind(this._authController)
    );
    /**
     * @openapi
     * /api/auth/logout:
     *   post:
     *     summary: Cerrar sesión (revocar refresh token y limpiar cookie)
     *     tags:
     *       - Auth
     *     responses:
     *       "204":
     *         description: Logout exitoso
     */
    this._router.post(
      "/logout",
      this._authController.logout.bind(this._authController)
    );
    /**
     * @openapi
     * /api/auth/me:
     *   get:
     *     summary: Información del usuario autenticado
     *     tags:
     *       - Auth
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: Payload del usuario obtenido del token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *             example:
     *               user:
     *                 id: 1
     *                 email: "gregoriocarranza@hotmail.com"
     *                 name: "Gregorio Carranza"
     */
    this._router.get(
      "/me",
      authMiddleware,
      this._authController.me.bind(this._authController)
    );
    /**
     * @openapi
     * /api/auth/verify-jwt:
     *   post:
     *     summary: Verificar un token (access o refresh)
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VerifyRequest'
     *     responses:
     *       "200":
     *         description: Resultado de la verificación
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/VerifyResponseSuccess'
     *                 - $ref: '#/components/schemas/VerifyResponseFailure'
     */
    this._router.post(
      "/verify-jwt",
      authMiddleware,
      bodyValidationMiddleware(VerifyJwtDTO),
      this._authController.verify.bind(this._authController)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
