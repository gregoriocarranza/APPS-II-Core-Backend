import { IUserDTO } from "../common/dto/users/IUser.dto";
import { IWalletDTO } from "../common/dto/wallet/IWallet.dto";
import { BadRequestError, NotFoundError } from "../common/utils/errors";
import { UserDAO } from "../database/dao/User/UserDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { IUser } from "../database/interfaces/user/user.interfaces";
import { IWallet } from "../database/interfaces/wallet/wallet.interfaces";
import { DomainEvent } from "../rabbitMq/Publisher";
import { WalletsService } from "./wallets.service";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  private dao: UserDAO;
  private walletService: WalletsService;

  constructor(dao?: UserDAO, walletService?: WalletsService) {
    this.dao = dao ?? new UserDAO();
    this.walletService = walletService ?? new WalletsService();
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
    await this.dao.getByUuid(uuid);
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`User ${uuid} no encontrada`);
    return { ok };
  }

  async handleUserCreated(event: DomainEvent<any>): Promise<void> {
    try {
      const userData = IUserDTO.build({
        ...event.payload,
        carrera_uuid: event.payload.carrera.id_carrera,
        rol: event.payload.rol.categoria,
        subrol: event.payload.rol.subcategoria ?? null,
      });

      const existingUser = await this.dao.getByUuid(userData.uuid);
      if (existingUser) {
        throw new BadRequestError(
          `[UserService - handleUserCreated] Usuario con UUID ${userData.uuid} ya existe. No se crea de nuevo.`
        );
      }
      const userCreated: IUser = await this.create(userData);
      console.log(
        `[UserService - handleUserCreated] Usuario con UUID ${userData.uuid} creado exitosamente.`
      );

      const walletData = IWalletDTO.build({
        uuid: uuidv4(),
        user_uuid: userCreated.uuid,
      });

      const walletCreated: IWallet =
        await this.walletService.create(walletData);
      console.log(
        `[UserService - handleUserCreated] wallet con UUID ${walletCreated.uuid} creado exitosamente para el usuario con UUID ${userData.uuid}.`
      );
    } catch (error: any) {
      console.error(
        `[UserService - handleUserCreated] Error en el handler de usuario:  ${error.message}.`
      );
    }
  }
}

export default new UserService();
