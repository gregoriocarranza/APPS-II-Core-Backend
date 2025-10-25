import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";

export class AuthRouter {
  private _router: Router;
  private _authController = new AuthController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.get(
      "/",
      this._authController.getAll.bind(this._authController),
    );
    this._router.get(
      "/:uuid",
      this._authController.getByUuid.bind(this._authController),
    );
    this._router.put(
      "/:uuid",
      this._authController.update.bind(this._authController),
    );
    this._router.post(
      "/",
      this._authController.create.bind(this._authController),
    );
    this._router.delete(
      "/:uuid",
      this._authController.delete.bind(this._authController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
