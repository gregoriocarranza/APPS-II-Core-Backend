import { plainToInstance, Transform } from "class-transformer";
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
  MANANA = "MAÑANA",
  TARDE = "TARDE",
  NOCHE = "NOCHE",
}

export enum CursoEstadoEnum {
  ACTIVO = "activo",
  CERRADO = "cerrado",
  CANCELADO = "cancelado",
}

export enum CursoDiaEnum {
  LUNES = "LUNES",
  MARTES = "MARTES",
  MIERCOLES = "MIERCOLES",
  JUEVES = "JUEVES",
  VIERNES = "VIERNES",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO",
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
  @Transform(({ value }) => value?.toUpperCase())
  sede!: string;

  @IsEnum(CursoDiaEnum)
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  dia!: CursoDiaEnum;

  @IsString()
  @IsNotEmpty()
  aula!: string;

  @IsString()
  @IsNotEmpty()
  periodo!: string;

  @IsEnum(CursoTurnoEnum)
  @Transform(({ value }) => value?.toUpperCase())
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
