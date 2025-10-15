import { Router } from "express";
import { UsersController } from "../../controllers/users/users.controller";

export class UsersRouter {
  private _router: Router;
  private _usersController = new UsersController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      "/",
      this._usersController.getAll.bind(this._usersController)
    );
    this._router.get(
      "/:uuid",
      this._usersController.getByUuid.bind(this._usersController)
    );
    this._router.put(
      "/:uuid",
      this._usersController.update.bind(this._usersController)
    );
    this._router.post(
      "/",
      this._usersController.create.bind(this._usersController)
    );
    this._router.delete(
      "/:uuid",
      this._usersController.delete.bind(this._usersController)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
