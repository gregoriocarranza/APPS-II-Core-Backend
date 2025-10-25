import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = header.substring("Bearer ".length);
  try {
    const payload = AuthService.instance.verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    console.error(err);

    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
