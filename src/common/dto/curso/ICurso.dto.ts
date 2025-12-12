// src/dto/cursos/curso.dto.ts
import {
  IsUUID,
  IsString,
  IsNumber,
  IsDateString,
  validateSync,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { ICurso } from "../../../database/interfaces/cursos/cursos.interfaces";
import {
  CursoDiaEnum,
  CursoEstadoEnum,
  CursoModalidadEnum,
  CursoTurnoEnum,
} from "./create.curso.dto";

export class ICursoDTO implements ICurso {
  @IsUUID()
  @Expose()
  uuid!: string;

  @IsUUID()
  @Expose()
  uuid_materia!: string;

  @IsString()
  @Expose()
  examen!: string;

  @IsString()
  @Expose()
  comision!: string;

  @IsEnum(CursoModalidadEnum)
  @Expose()
  modalidad!: CursoModalidadEnum;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  @Expose()
  sede!: string;

  @IsString()
  @Expose()
  aula!: string;

  @IsString()
  @Expose()
  periodo!: string;

  @IsEnum(CursoTurnoEnum)
  @Transform(({ value }) => value?.toUpperCase())
  @Expose()
  turno!: CursoTurnoEnum;

  @IsEnum(CursoEstadoEnum)
  @Expose()
  estado!: CursoEstadoEnum;

  @IsEnum(CursoDiaEnum)
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  @Expose()
  dia!: CursoDiaEnum;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose({ name: "cantidad_max" })
  cantidad_max!: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose({ name: "cantidad_min" })
  cantidad_min!: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @Expose()
  desde!: string;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @Expose()
  hasta!: string;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @Expose()
  created_at!: string;

  @IsDateString()
  @Transform(({ value }) => new Date().toISOString())
  @Expose()
  updated_at!: string;

  static build(data: any): ICursoDTO {
    const dto = plainToInstance(ICursoDTO, data, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error(`CursoDTO validation failed: ${JSON.stringify(errors)}`);
    }

    return dto;
  }
}
