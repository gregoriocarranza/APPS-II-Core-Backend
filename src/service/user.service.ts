import { NotFoundError } from "../common/utils/errors";
import { UserDAO } from "../database/dao/User/UserDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { IUser } from "../database/interfaces/user/user.interfaces";

export class UserService {
  private dao: UserDAO;

  constructor(dao?: UserDAO) {
    this.dao = dao ?? new UserDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<IDataPaginator<IUser>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    return this.dao.getAll(page, limit);
  }

  async getByUuid(uuid: string): Promise<IUser> {
    const user = await this.dao.getById(uuid);
    if (!user) throw new NotFoundError(`User ${uuid} no encontrada`);
    return user;
  }

  async getByUserId(user_id: number): Promise<IUser | undefined> {
    return this.dao.getByUserId(user_id);
  }

  async create(payload: IUser): Promise<IUser> {
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<IUser>): Promise<IUser> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`User ${uuid} no encontrada`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`User ${uuid} no encontrada`);
    return { ok };
  }
}

export default new UserService();
