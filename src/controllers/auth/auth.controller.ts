import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../service/auth.service";
import { authConfig } from "../../common/config/auth/auth.config";

export class AuthController {
  private authService = AuthService.instance;

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await this.authService.validateCredentials(email, password);

      const { accessToken, refreshCookie } =
        await this.authService.issueTokenPair(user);

      res
        .cookie(
          authConfig.cookie.name,
          refreshCookie.value,
          authConfig.cookie.options
        )
        .status(200)
        .json({
          success: true,
          access_token: accessToken,
          refresh_token: refreshCookie.value,
          token_type: "Bearer",
          expires_in: this.authService.accessTokenTtlSeconds,
        });
    } catch (err) {
      next(err);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cookieToken = req.body.refresh_token || req.cookies?.refresh_token;
      if (!cookieToken) {
        res.status(401).json({ error: "Refresh token requerido" });
        return;
      }

      const { accessToken, refreshCookie } =
        await this.authService.rotateRefreshToken(cookieToken);

      res
        .cookie(
          authConfig.cookie.name,
          refreshCookie.value,
          authConfig.cookie.options
        )
        .status(200)
        .json({
          success: true,
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: this.authService.accessTokenTtlSeconds,
        });
    } catch (err) {
      next(err);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cookieName = authConfig.cookie.name;
      const cookieOpts = authConfig.cookie.options;

      const cookieToken = req.cookies?.[cookieName];
      if (cookieToken) {
        await this.authService.revokeRefreshToken(cookieToken);
      }

      res.clearCookie(cookieName, cookieOpts).status(204).send();
    } catch (err) {
      next(err);
    }
  }

  public async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const auth = req.headers.authorization;
      if (!auth?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token requerido" });
        return;
      }
      const token = auth.substring("Bearer ".length);
      const payload = this.authService.verifyAccessToken(token);

      res.status(200).json({ user: payload });
    } catch (err) {
      next(err);
    }
  }

  public async verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authData = req.body;
      let payload = null;

      if (authData.kind === "refresh") payload = this.authService.verifyRefreshToken(authData.token);
      else payload = this.authService.verifyAccessToken(authData.token);

      if (!payload) throw new Error("Token inválido");

      res.status(200).json({
        valid: true,
        kind: authData.kind,
      });
    } catch (err: any) {
      res.status(200).json({
        valid: false,
        kind: String(
          req.body?.kind ?? req.query?.kind ?? "access"
        ).toLowerCase(),
        reason: "Token inválido o expirado",
      });
    }
  }
}
