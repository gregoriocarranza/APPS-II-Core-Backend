import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { TransfersService } from "../../service/trensfers.service";
import { NotFoundError } from "../../common/utils/errors";

export class TransfersController implements IBaseController {
  transfersService: TransfersService;
  constructor() {
    this.transfersService = new TransfersService();
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, wallet_uuid } = req.query as {
        page?: string;
        limit?: string;
        wallet_uuid?: string;
      };

      if (wallet_uuid) {
        const data = await this.transfersService.getByWallet(wallet_uuid);
        res.status(200).json({ success: true, data });
        return;
      }

      const result = await this.transfersService.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  public async getByUuid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;

      const data = await this.transfersService.getByWallet(uuid);
      res.status(200).json({ success: true, data });
      return;
    } catch (err: any) {
      next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      console.log(uuid);
      res.send("Function not implemented");
    } catch (err: any) {
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
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
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      await this.transfersService.delete(uuid);
      res.status(204).end();
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }
}
