import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function bodyValidationMiddleware<T extends object>(
  type: new () => T,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const errors = await validate(plainToInstance(type, req.body));

    if (errors.length > 0) {
      const userErrorMessage = flattenValidationErrors(errors);

      const validationError: any = new Error(userErrorMessage.join("; "));
      validationError.statusCode = 400;
      return next(validationError);
    }
    next();
  };
}

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = "",
): string[] {
  const msgs: string[] = [];

  for (const e of errors) {
    // arma el path "attachments[0].href" si es un índice
    const isIndex = /^\d+$/.test(e.property);
    const path =
      parentPath === ""
        ? e.property
        : isIndex
          ? `${parentPath}[${e.property}]`
          : `${parentPath}.${e.property}`;

    if (e.constraints) {
      msgs.push(`${path}: ${Object.values(e.constraints).join(", ")}`);
    }
    if (e.children && e.children.length > 0) {
      msgs.push(...flattenValidationErrors(e.children, path));
    }
  }

  return msgs;
}
