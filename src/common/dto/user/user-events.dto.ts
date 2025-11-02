import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
  IsISO8601,
} from "class-validator";
import { plainToInstance, Transform } from "class-transformer";
import { IUser } from "../../../database/interfaces/user/user.interfaces";

const USER_STATUS = ["activo", "inactivo", "suspendido"] as const;

export class UserCreatedEventDTO implements IUser {
  @IsUUID()
  uuid!: string;

  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  legajo!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  dni!: number;

  @IsEmail()
  email!: string;

  @IsString()
  telefono_personal!: string;

  @IsIn(USER_STATUS)
  status!: (typeof USER_STATUS)[number];

  @IsString()
  rol!: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined || value === "" ? null : String(value),
  )
  carrera_uuid!: string | null;

  @IsISO8601()
  fecha_alta!: string;

  static build(raw: unknown): IUser {
    const dto = plainToInstance(UserCreatedEventDTO, raw, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto, { whitelist: true });
    if (errors.length > 0) {
      throw new Error(`Invalid user.created payload: ${JSON.stringify(errors)}`);
    }
    return dto;
  }
}

export class UserDeletedEventDTO {
  @IsUUID()
  uuid!: string;

  static build(raw: unknown): UserDeletedEventDTO {
    const dto = plainToInstance(UserDeletedEventDTO, raw, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto, { whitelist: true });
    if (errors.length > 0) {
      throw new Error(`Invalid user.deleted payload: ${JSON.stringify(errors)}`);
    }
    return dto;
  }
}

export const unwrapPayload = <T = unknown>(
  raw: unknown,
  nestedKeys: string | string[] = "payload",
): T => {
  const keys = Array.isArray(nestedKeys) ? nestedKeys : [nestedKeys];

  if (raw && typeof raw === "object") {
    for (const key of keys) {
      if (key in (raw as Record<string, unknown>)) {
        return (raw as Record<string, T>)[key];
      }
    }
  }

  return raw as T;
};
