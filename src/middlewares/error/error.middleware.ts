import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  const statusCode =
    typeof err.statusCode === "number"
      ? err.statusCode
      : typeof err.status === "number"
        ? err.status
        : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
