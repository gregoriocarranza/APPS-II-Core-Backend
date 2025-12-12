import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  JwtPayload,
  RefreshRecord,
  UserLike,
} from "../interfaces/auth.interface";
import { authConfig } from "../common/config/auth/auth.config";
import {
  IBackoficeAuthResponse,
  IUser,
} from "../database/interfaces/user/user.interfaces";
import { CarrerasService } from "./carreras.service";
import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";
import dotenv from "dotenv";
import { IWallet } from "../database/interfaces/wallet/wallet.interfaces";
import { WalletsService } from "./wallets.service";
import { UserService } from "./user.service";
import { InternalServerError, UnauthorizedError } from "../common/utils/errors";
dotenv.config();

export class AuthService {
  private static _instance: AuthService;
  private refreshStore = new Map<string, RefreshRecord>();
  private carreraService: CarrerasService;
  private walletService: WalletsService;
  private userService: UserService;

  private constructor(
    carreraService?: CarrerasService,
    walletService?: WalletsService,
    userService?: UserService
  ) {
    this.carreraService = carreraService ?? new CarrerasService();
    this.walletService = walletService ?? new WalletsService();
    this.userService = userService ?? new UserService();
  }

  static get instance(): AuthService {
    if (!this._instance) this._instance = new AuthService();
    return this._instance;
  }

  public get accessTokenTtlSeconds(): number {
    return authConfig.access.ttl;
  }

  async checkUserExist(userLike: UserLike): Promise<boolean> {
    const user: IUser = await this.userService.getByUuid(userLike.uuid);
    return !!user;
  }

  async mapToUserLike(user: IBackoficeAuthResponse): Promise<UserLike> {
    let career: ICarrera | null = null;
    const wallet: IWallet[] = await this.walletService.getByUserUuid(
      user.id_usuario
    );
    let walletsUuids: string[] = [];
    if (user.carrera && user.carrera.id_carrera) {
      career = await this.carreraService.getByUuid(user.carrera.id_carrera);
    }
    if (wallet.length > 0) {
      wallet.forEach((w) => {
        walletsUuids.push(w.uuid);
      });
    }
    return {
      uuid: user.id_usuario,
      email: user.email_institucional,
      name: user.nombre + (user.apellido ? ` ${user.apellido}` : ""),
      role: user.rol.categoria,
      subrol: user.rol.subcategoria || null,
      career: career ? { uuid: career.uuid, name: career.name } : null,
      wallet: walletsUuids,
    };
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<UserLike> {
    if (!email || !password) throw new Error("Credenciales inválidas");

    const response = await fetch(
      `${process.env.BO_API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_institucional: email,
          contraseña: password,
        }),
      }
    );

    if (!response.ok) {
      const raw = await response.text().catch(() => "");
      if (response.status >= 500) {
        console.error("[validateCredentials] Error 500 desde Backoffice:", raw);
        throw new InternalServerError(
          "El servidor está experimentando problemas. Intentalo más tarde."
        );
      }

      if (response.status === 400 || response.status === 401) {
        console.error("[validateCredentials] Error 4xx desde Backoffice:", raw);
        throw new UnauthorizedError("Usuario o contraseña inválidos");
      }

      throw new Error(`Error desconocido: ${response.status}`);
    }

    const user = await response.json();
    return await this.mapToUserLike(user);
  }

  async issueTokenPair(user: UserLike) {
    const jti = crypto.randomUUID();

    const accessToken = jwt.sign(
      {
        sub: String(user.uuid),
        email: user.email,
        name: user.name,
        role: user.role,
        subrol: user.subrol,
        career: user.career,
        wallet: user.wallet,
      },
      authConfig.access.secret,
      { expiresIn: authConfig.access.ttl }
    );

    const refreshToken = jwt.sign(
      {
        sub: String(user.uuid),
        email: user.email,
        name: user.name,
        role: user.role,
        subrol: user.subrol,
        career: user.career,
        wallet: user.wallet,
      } as JwtPayload,
      authConfig.refresh.secret,
      { expiresIn: authConfig.refresh.ttl, jwtid: jti }
    );

    const decoded = jwt.decode(refreshToken) as any;
    const exp = decoded?.exp as number | undefined;
    this.refreshStore.set(jti, {
      jti,
      userId: String(user.uuid),
      revoked: false,
      expiresAt: exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });

    const refreshCookie = {
      value: refreshToken,
      options: authConfig.cookie.options,
    };

    return { accessToken, refreshToken, refreshCookie };
  }

  async rotateRefreshToken(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    const rec = this.refreshStore.get(payload.jti);
    if (!rec || rec.revoked) {
      throw new Error("Refresh token inválido o revocado");
    }

    rec.revoked = true;
    this.refreshStore.set(rec.jti, rec);

    const user: UserLike = {
      uuid: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      subrol: payload.subrol,
      career: payload.career,
      wallet: payload.wallet,
    };
    const pair = await this.issueTokenPair(user);

    const newPayload = jwt.decode(pair.refreshToken) as any;
    const newJti = newPayload?.jti as string | undefined;
    if (newJti) {
      const newRec = this.refreshStore.get(newJti);
      if (newRec) newRec.parentJti = rec.jti;
    }
    return { ...pair, user };
  }

  async revokeRefreshToken(refreshToken: string) {
    try {
      const payload = this.verifyRefreshToken(refreshToken);
      const rec = this.refreshStore.get(payload.jti);
      if (rec) {
        rec.revoked = true;
        this.refreshStore.set(rec.jti, rec);
      }
    } catch {
      // token inválido; no hace falta arrojar en logout
    }
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, authConfig.access.secret) as JwtPayload;
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, authConfig.refresh.secret) as JwtPayload;
  }
}
