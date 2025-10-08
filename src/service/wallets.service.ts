import { NotFoundError } from "../common/utils/errors";
import { WalletDAO } from "../database/dao/Wallet/WalletDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { IWallet } from "../database/interfaces/wallet/wallet.interfaces";

export class WalletsService {
  private dao: WalletDAO;

  constructor(dao?: WalletDAO) {
    this.dao = dao ?? new WalletDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<IWallet>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<IWallet> {
    const wallet = await this.dao.getById(uuid);
    if (!wallet) throw new NotFoundError(`Wallet ${uuid} no encontrada`);
    return wallet;
  }

  async getByUserId(user_id: string): Promise<IWallet[]> {
    return this.dao.getByUserId(user_id);
  }

  async create(payload: IWallet): Promise<IWallet> {
    // Si tenés un DTO de creación sin campos calculados, usalo acá
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<IWallet>): Promise<IWallet> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Wallet ${uuid} no encontrada`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Wallet ${uuid} no encontrada`);
    return { ok };
  }
}

export default new WalletsService();
