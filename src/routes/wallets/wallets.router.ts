import { Router } from "express";
import { WalletsController } from "../../controllers/wallets/wallets.controller";
import { bodyValidationMiddleware } from "../../middlewares/bodyValidation.middleware";
import { WalletCreatedDTO } from "../../common/dto/wallet.dto";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { administratorMiddleware } from "../../middlewares/administrator.middleware";

export class WalletsRouter {
  private _router: Router;
  private _walletsController = new WalletsController();
  constructor() {
    this._router = Router();
    this.initRoutes();
  }
  private initRoutes(): void {
    this._router.use(authMiddleware);

    this._router.get(
      "/",
      administratorMiddleware,
      this._walletsController.getAll.bind(this._walletsController),
    );
    this._router.get(
      "/:uuid",
      this._walletsController.getByUuid.bind(this._walletsController),
    );
    this._router.put(
      "/:uuid",
      administratorMiddleware,
      this._walletsController.update.bind(this._walletsController),
    );
    this._router.post(
      "/",
      administratorMiddleware,
      bodyValidationMiddleware(WalletCreatedDTO),
      this._walletsController.create.bind(this._walletsController),
    );
    this._router.delete(
      "/:uuid",
      administratorMiddleware,
      this._walletsController.delete.bind(this._walletsController),
    );
  }
  public get router(): Router {
    return this._router;
  }
}
