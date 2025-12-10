import { IUserDTO } from "../common/dto/users/IUser.dto";
import { BadRequestError, NotFoundError } from "../common/utils/errors";
import { roles } from "../common/utils/roles";
import { UserDAO } from "../database/dao/User/UserDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { IUser } from "../database/interfaces/user/user.interfaces";
import { DomainEvent } from "../rabbitMq/Publisher";

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
    const user = await this.dao.getByUuid(uuid);
    if (!user) throw new NotFoundError(`User ${uuid} no encontrada`);
    return user;
  }

  async getByRole(role: string): Promise<IUser> {
    const user = await this.dao.getByRole(role);
    if (!user) throw new NotFoundError(`User with role ${role} not found`);
    return user;
  }

  async getByEmail(email: string): Promise<IUser | undefined> {
    return this.dao.getByEmail(email);
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

  async handleUserCreated(event: DomainEvent<any>): Promise<void> {
    const match = roles.find((r) => r.id_rol === event.payload.id_rol);

    if (!match) {
      throw new BadRequestError(
        `[UserService] No existe un rol con id_rol=${event.payload.id_rol}`
      );
    }

    const userData = IUserDTO.build({
      ...event.payload,
      rol: match.categoria,
      subrol: match.subcategoria ?? null,
    });

    const existingUser = await this.dao.getByUuid(userData.uuid);
    if (existingUser) {
      throw new BadRequestError(
        `[UserService] Usuario con UUID ${userData.uuid} ya existe. No se crea de nuevo.`
      );
    }
    await this.create(userData);
    console.log(
      `[UserService] Usuario con UUID ${userData.uuid} creado exitosamente.`
    );
  }
}

export default new UserService();
