import {
  IsUUID,
  IsString,
  IsInt,
  IsOptional,
  IsIn,
  validateSync,
} from "class-validator";
import { plainToInstance } from "class-transformer";
import { IUser } from "../../../database/interfaces/user/user.interfaces";

export class ToUserDTO {
  @IsUUID()
  uuid!: string;

  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  legajo!: string;

  @IsString()
  fecha_alta!: string;

  @IsInt()
  dni!: number;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  telefono_personal?: string;

  @IsIn(["activo", "inactivo", "suspendido"])
  status!: string;

  @IsString()
  rol!: string;

  @IsOptional()
  @IsUUID()
  carrera_uuid?: string;

  static build(data: IUser): ToUserDTO {
    const dto = plainToInstance(ToUserDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
