import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";


export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = header.substring("Bearer ".length);
  try {
    const payload = AuthService.instance.verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
