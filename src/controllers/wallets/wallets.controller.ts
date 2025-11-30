import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import walletsService, { WalletsService } from "../../service/wallets.service";
import {
  IWallet,
  WalletStatus,
} from "../../database/interfaces/wallet/wallet.interfaces";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";

export class WalletsController implements IBaseController {
  constructor(private service: WalletsService = walletsService) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit, user_uuid } = req.query as {
        page?: string;
        limit?: string;
        user_uuid?: string;
      };

      if (user_uuid) {
        const data = await this.service.getByUserUuid(user_uuid);
        res.status(200).json({ success: true, data });
        return;
      }

      const result = await this.service.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  public async getByJwt(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const wallet = await this.service.getByUserUuid(user.uuid);
      res.status(200).json({ success: true, data: wallet });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
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
      const wallet = await this.service.getByUuid(uuid);
      res.status(200).json({ success: true, data: wallet });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = {
        ...req.body,
        uuid: uuidv4(),
        balance: 1000,
        status: WalletStatus.ACTIVE,
      };
      const created = await this.service.create(payload);
      res.status(201).json({ success: true, data: created });
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
      const partial = req.body as Partial<IWallet>;
      const updated = await this.service.update(uuid, partial);
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
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
      await this.service.delete(uuid);
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

export default new WalletsController();
