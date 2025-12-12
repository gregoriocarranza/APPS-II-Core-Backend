// src/dto/users/user.dto.ts
import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  validateSync,
} from "class-validator";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { IUser } from "../../../database/interfaces/user/user.interfaces";

export class IUserDTO implements IUser {
  @IsUUID()
  @Expose({ name: "user_id" })
  uuid!: string;

  @IsString()
  @Expose()
  nombre!: string;

  @IsString()
  @Expose()
  apellido!: string;

  @IsString()
  @Expose()
  legajo!: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose()
  dni!: number;

  @Expose({ name: "email_personal" })
  @IsString()
  email!: string;

  @Expose({ name: "telefono_personal" })
  @IsString()
  telefono_personal!: string;

  @Transform(({ value }) => {
    return value ? "activo" : "inactivo";
  })
  @Expose()
  status!: "activo" | "inactivo" | "suspendido";

  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  @Expose()
  rol!: string;

  @IsOptional()
  @IsString()
  @Expose()
  carrera_uuid!: string | null;

  @IsDateString()
  @Expose({ name: "fecha_alta" })
  @Transform(({ value }) => new Date(value).toISOString())
  fecha_alta!: string;

  @IsOptional()
  @Expose()
  subrol: any;

  static build(data: any): IUserDTO {
    const dto = plainToInstance(IUserDTO, data, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error(`UserDTO validation failed: ${JSON.stringify(errors)}`);
    }

    return dto;
  }
}
