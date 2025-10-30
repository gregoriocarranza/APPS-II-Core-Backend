import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  IsNotEmpty,
  validateSync,
  IsDateString,
} from "class-validator";
import { IMateriaDTO } from "../../../database/interfaces/materia/materia.interfaces";
import { plainToInstance, Transform } from "class-transformer";
import { ICarrera } from "../../../database/interfaces/carrera/carreras.interfaces";
import { CarreraDTO } from "../carrera/carrera.dto";

export enum MateriaApprovalMethodEnum {
  FINAL = "final",
  PROMOCION = "promocion",
  TRABAJO_PRACTICO = "trabajo_practico",
}

export class MateriaDTO {
  @IsUUID()
  uuid!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsUUID()
  uuid_carrera!: string;
  carrera!: ICarrera;
  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(MateriaApprovalMethodEnum)
  approval_method!: MateriaApprovalMethodEnum;

  @IsBoolean()
  is_elective!: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  created_at!: string;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  updated_at!: string;

  static build(data: IMateriaDTO): MateriaDTO {
    const dto = plainToInstance(MateriaDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));

    if (data.carrera) dto.carrera = CarreraDTO.build(data.carrera);
    return dto;
  }
}
