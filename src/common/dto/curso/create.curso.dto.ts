import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
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
  @IsOptional()
  @IsUUID()
  uuid?: string;

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
}
