import { NotFoundError } from "../common/utils/errors";
import { TransferDAO } from "../database/dao/Transfer/TransferDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { ITransfer } from "../database/interfaces/transfer/transfer.interface";


export class TransfersService {
  private dao: TransferDAO;

  constructor(dao?: TransferDAO) {
    this.dao = dao ?? new TransferDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<ITransfer>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<ITransfer> {
    const transfer = await this.dao.getByUuid(uuid);
    if (!transfer) throw new NotFoundError(`Transfer ${uuid} no encontrada`);
    return transfer;
  }

  async getByWallet(walletUuid: string): Promise<ITransfer[]> {
    if (!walletUuid) throw new Error("walletUuid es requerido");
    return this.dao.getByWallet(walletUuid);
  }

  async create(payload: ITransfer): Promise<ITransfer> {
    const created = await this.dao.create(payload);
    // await emitTransferCreated(created);
    return created;
  }

  async update(uuid: string, partial: Partial<ITransfer>): Promise<ITransfer> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Transfer ${uuid} no encontrada`);
    // await emitTransferUpdated(updated);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Transfer ${uuid} no encontrada`);
    // await emitTransferDeleted(uuid);
    return { ok };
  }
}

export default new TransfersService();
