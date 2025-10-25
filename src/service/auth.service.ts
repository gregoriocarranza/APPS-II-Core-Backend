// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  JwtPayload,
  RefreshRecord,
  UserLike,
} from "../interfaces/auth.interface";
// import { UserService } from "./user.service";
import { authConfig } from "../common/config/auth/auth.config";

export class AuthService {
  private static _instance: AuthService;
  private refreshStore = new Map<string, RefreshRecord>();

  static get instance(): AuthService {
    if (!this._instance) this._instance = new AuthService();
    return this._instance;
  }

  public get accessTokenTtlSeconds(): number {
    return authConfig.access.ttl;
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<UserLike> {
    // TODO: llamar al microservicio (HTTP/RPC). Por ahora mock local:
    if (!email || !password) throw new Error("Credenciales inválidas");

    return {
      id: "u_123",
      email,
      name: "Usuario Demo",
      role: "student",
      career: "IT",
    };
  }

  async issueTokenPair(user: UserLike) {
    const jti = crypto.randomUUID();

    const accessToken = jwt.sign(
      {
        sub: String(user.id),
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
        sub: String(user.id),
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
      userId: String(user.id),
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
      id: payload.sub,
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
