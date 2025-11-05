import { plainToInstance } from "class-transformer";
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  validateSync,
} from "class-validator";

export enum CursoModalidadEnum {
  PRESENCIAL = "PRESENCIAL",
  VIRTUAL = "VIRTUAL",
  HIBRIDA = "HÍBRIDA",
}

export enum CursoTurnoEnum {
  MANANA = "Mañana",
  TARDE = "Tarde",
  NOCHE = "Noche",
}

export enum CursoEstadoEnum {
  ACTIVO = "activo",
  CERRADO = "cerrado",
  CANCELADO = "cancelado",
}

export class CursoCreateDTO {
  @IsUUID()
  @IsNotEmpty()
  uuid_materia!: string;

  @IsOptional()
  @IsString()
  examen?: string;

  @IsOptional()
  @IsString()
  comision?: string;

  @IsEnum(CursoModalidadEnum)
  modalidad!: CursoModalidadEnum;

  @IsString()
  @IsNotEmpty()
  sede!: string;

  @IsString()
  @IsNotEmpty()
  aula!: string;

  @IsString()
  @IsNotEmpty()
  periodo!: string;

  @IsEnum(CursoTurnoEnum)
  turno!: CursoTurnoEnum;

  @IsEnum(CursoEstadoEnum)
  estado!: CursoEstadoEnum;

  @IsInt()
  cantidad_max!: number;

  @IsInt()
  cantidad_min!: number;

  @IsDateString()
  desde!: string;

  @IsDateString()
  hasta!: string;

  static build(data: any): CursoCreateDTO {
    const dto = plainToInstance(CursoCreateDTO, data, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(dto, { whitelist: true });
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
