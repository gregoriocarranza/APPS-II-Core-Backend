import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";
import UserService from "../service/user.service";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = header.substring("Bearer ".length);
  try {
    const payload = AuthService.instance.verifyAccessToken(token);
    const user = await UserService.getByUuid(payload.sub);
    (req as any).user = user;
    next();
  } catch (err) {
    console.error(err);

    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
