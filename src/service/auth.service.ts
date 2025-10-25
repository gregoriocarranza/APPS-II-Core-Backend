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
import { getServiceEnvironment } from "../common/utils/environment.resolver";
import { IUser } from "../database/interfaces/user/user.interfaces";
import { CarrerasService } from "./carreras.service";
import { ICarrera } from "../database/interfaces/carrera/carreras.interfaces";

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

  private async mapToUserLike(u: IUser): Promise<UserLike> {
    let career: ICarrera | null = null;
    if (u.carrera_uuid) {
      career = await this.carreraService.getByUuid(u.carrera_uuid);
    }
    return {
      uuid: u.uuid,
      email: u.email,
      name: u.nombre,
      role: u.rol,
      career:
        u.carrera_uuid && career
          ? {
              uuid: u.carrera_uuid,
              name: career.name,
            }
          : null,
    };
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<UserLike> {
    // TODO: llamar al microservicio (HTTP/RPC). Por ahora mock local:
    if (!email || !password) throw new Error("Credenciales inválidas");
    let user: IUser | undefined = undefined;
    if (getServiceEnvironment() !== "production") {
      user = await this.userService.getByEmail(email);
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
