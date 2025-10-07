import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";

export class TransfersController implements IBaseController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.send("Ok");
    } catch (err: any) {
      next(err);
    }
  }

  public async getByUuid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      console.log(uuid);
      res.send("Ok");
    } catch (err: any) {
      next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      console.log(uuid);
      res.send("Ok");
    } catch (err: any) {
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.send("Ok");
    } catch (err: any) {
      next(err);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      console.log(uuid);
      res.send("Ok");
    } catch (err: any) {
      next(err);
    }
  }
}
