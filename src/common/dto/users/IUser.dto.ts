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
  @Expose({ name: "user_id" }) // Mapear correo_personal a email
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

  @Expose({ name: "email_institucional" }) // Mapear correo_personal a email
  @IsString()
  email!: string;

  @IsString()
  // telefono_personal!: string; //recuperar
  telefono_personal: string = "123456789";

  @Transform(({ value }) => {
    return value ? "activo" : "inactivo";
  })
  @Expose()
  status!: "activo" | "inactivo" | "suspendido";

  @IsString()
  @Expose()
  rol!: string;

  @IsOptional()
  @IsString()
  @Expose()
  carrera_uuid!: string | null;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  // fecha_alta!: string; //recuperar
  fecha_alta: string = new Date().toISOString();

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
