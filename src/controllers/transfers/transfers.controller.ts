import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { TransfersService } from "../../service/trensfers.service";
import {
  InsufficientFundsError,
  NotFoundError,
} from "../../common/utils/errors";
import { TransferCreateDTO } from "../../common/dto/transfer/create.transfer.dto";
import { WalletsService } from "../../service/wallets.service";
import { ITransferDTO } from "../../common/dto/transfer/ITransfer.dto";
import { ITransfer } from "../../database/interfaces/transfer/transfer.interface";
export class TransfersController implements IBaseController {
  transfersService: TransfersService;
  walletService: WalletsService;
  constructor() {
    this.transfersService = new TransfersService();
    this.walletService = new WalletsService();
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

  public async getAllByJwt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const wallet = await this.walletService.getByUserUuid(user.uuid);
      if (!wallet) {
        throw new NotFoundError(
          `Wallet del usuario ${user.uuid} no encontrada`
        );
      }
      let data: ITransfer[] = [];
      for (const w of wallet) {
        const transfers = await this.transfersService.getByWallet(w.uuid);
        data = data.concat(transfers);
      }
      res.status(200).json({ success: true, data });
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
  ): Promise<any> {
    try {
      const transferDto: TransferCreateDTO = req.body;

      if (transferDto.from === transferDto.to)
        throw new Error("No se puede transferir a la misma wallet");

      const [fromWallet, toWallet] = await Promise.all([
        this.walletService.getByUuid(transferDto.from),
        this.walletService.getByUuid(transferDto.to),
      ]);

      if (!fromWallet)
        throw new NotFoundError(`Wallet ${transferDto.from} no encontrada`);
      if (!toWallet)
        throw new NotFoundError(`Wallet ${transferDto.to} no encontrada`);

      if (toWallet.currency !== transferDto.currency)
        throw new Error(
          `La wallet destino utiliza una moneda diferente: ${toWallet.currency}`
        );

      if (Number(fromWallet.balance) < Number(transferDto.amount))
        throw new InsufficientFundsError(
          `Fondos insuficientes en la wallet ${fromWallet.uuid}`
        );

      const updatedFromWallet = await this.walletService.update(
        fromWallet.uuid,
        {
          balance: Number(fromWallet.balance) - Number(transferDto.amount),
        }
      );

      const updatedToWallet = await this.walletService.update(toWallet.uuid, {
        balance: Number(toWallet.balance) + Number(transferDto.amount),
      });

      const iTransferDTO = ITransferDTO.build(transferDto);

      const transfers = this.transfersService.create(iTransferDTO);

      res.status(201).json({
        success: true,
        data: {
          fromWallet: updatedFromWallet,
          toWallet: updatedToWallet,
          transfers,
        },
      });
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
