import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { LoginDTO, VerifyJwtDTO } from "../../common/dto/auth.dto";

export class AuthRouter {
  private _router: Router;
  private _authController = new AuthController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.post(
      "/login",
      bodyValidationMiddleware(LoginDTO),
      this._authController.login.bind(this._authController)
    );
    this._router.post(
      "/refresh",
      this._authController.refresh.bind(this._authController)
    );
    this._router.post(
      "/logout",
      this._authController.logout.bind(this._authController)
    );
    this._router.get("/me", this._authController.me.bind(this._authController));
    this._router.post(
      "/verify-jwt",
      bodyValidationMiddleware(VerifyJwtDTO),
      this._authController.verify.bind(this._authController)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
