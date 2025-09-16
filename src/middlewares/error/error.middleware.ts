import { NextFunction, Response, Request } from "express";
export const errorMiddleware = (
  err: any,
  req: Request | any,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);
  const statusError: number =
    err.statusError ||
    err.statusCode ||
    err.status ||
    req.statusCode ||
    req.statusError ||
    500;
  res.status(statusError).json({
    success: false,
    message: err.message,
  });
};
