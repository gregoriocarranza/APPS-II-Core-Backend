import {
  IsUUID,
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  validateSync,
  IsOptional,
} from "class-validator";
import { ICursoDTO } from "../../../database/interfaces/cursos/cursos.interfaces";
import { MateriaDTO } from "../materia/materia.dto";
import { CarreraDTO } from "../carrera/carrera.dto";
import { IMateriaDTO } from "../../../database/interfaces/materia/materia.interfaces";
import { ICarrera } from "../../../database/interfaces/carrera/carreras.interfaces";
import { plainToInstance, Transform } from "class-transformer";
import { CursoDiaEnum, CursoEstadoEnum, CursoModalidadEnum, CursoTurnoEnum } from "./create.curso.dto";

export class CursoDTO {
  @IsUUID()
  uuid!: string;

  @IsUUID()
  uuid_materia!: string;

  @IsOptional()
  materia!: IMateriaDTO;

  @IsOptional()
  carrera!: ICarrera;

  @IsString()
  examen!: string;

  @IsString()
  comision!: string;

  @IsEnum(CursoModalidadEnum)
  modalidad!: CursoModalidadEnum;

  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  sede!: string;

  @IsString()
  aula!: string;

  @IsEnum(CursoDiaEnum)
  @Transform(({ value }) => value?.toUpperCase())
  dia!: CursoDiaEnum;

  @IsString()
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

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  desde!: string;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  hasta!: string;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  created_at!: string;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  updated_at!: string;

  static build(data: ICursoDTO): CursoDTO {
    const dto = plainToInstance(CursoDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));

    if (data.materia) dto.materia = MateriaDTO.build(data.materia);
    if (data.carrera) dto.carrera = CarreraDTO.build(data.carrera);

    return dto;
  }
}
