// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  JwtPayload,
  RefreshRecord,
  UserLike,
} from "../interfaces/auth.interface";
import { UserService } from "./user.service";
import { authConfig } from "../common/config/auth/auth.config";
import {
  IBackoficeAuthResponse,
  IUser,
} from "../database/interfaces/user/user.interfaces";
import { CarrerasService } from "./carreras.service";
import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";
import dotenv from "dotenv";
dotenv.config();

export class AuthService {
  private static _instance: AuthService;
  private refreshStore = new Map<string, RefreshRecord>();
  private userService: UserService;
  private carreraService: CarrerasService;

  private constructor(
    userService?: UserService,
    carreraService?: CarrerasService
  ) {
    this.userService = userService ?? new UserService();
    this.carreraService = carreraService ?? new CarrerasService();
  }

  static get instance(): AuthService {
    if (!this._instance) this._instance = new AuthService();
    return this._instance;
  }

  public get accessTokenTtlSeconds(): number {
    return authConfig.access.ttl;
  }

  isInternalUser(user: IUser | IBackoficeAuthResponse): user is IUser {
    return "uuid" in user;
  }

  async mapToUserLike(user: IUser | IBackoficeAuthResponse): Promise<UserLike> {
    let career: ICarrera | null = null;

    if (this.isInternalUser(user) && user.carrera_uuid) {
      career = await this.carreraService.getByUuid(user.carrera_uuid);
    }

    return {
      uuid: this.isInternalUser(user) ? user.uuid : user.id_usuario,
      email: this.isInternalUser(user) ? user.email : user.email_institucional,
      name: user.nombre + (user.apellido ? ` ${user.apellido}` : ""),
      role: this.isInternalUser(user) ? user.rol : user.rol.categoria,
      subrol: this.isInternalUser(user)
        ? user.subrol || null
        : user.rol.subcategoria || null,
      career:
        this.isInternalUser(user) && user.carrera_uuid && career
          ? { uuid: user.carrera_uuid, name: career.name }
          : null,
    };
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<UserLike> {
    // TODO: llamar al microservicio (HTTP/RPC). Por ahora mock local:
    if (!email || !password) throw new Error("Credenciales inválidas");
    let user: IUser | IBackoficeAuthResponse | undefined = undefined;

    user = await this.userService.getByEmail(email);

    if (!user) {
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
        throw new Error("Usuario o contraseña inválidos");
      }
      user = await response.json();
    }

    if (!user) throw new Error("Usuario o contraseña inválidos");

    return this.mapToUserLike(user);
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
