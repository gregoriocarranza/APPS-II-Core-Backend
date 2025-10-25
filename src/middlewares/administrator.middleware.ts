import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../interfaces/auth.interface";

export function administratorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const extendedReq = req as ExtendedRequest;

  if (!extendedReq.user) {
    return res
      .status(401)
      .json({ success: false, message: "Usuario no autenticado" });
  }

  if (extendedReq.user.role !== "administrador") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado: requiere rol administrador",
    });
  }

  next();
}
