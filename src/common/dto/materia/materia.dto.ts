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
import { IMateria } from "../../../database/interfaces/materia/materia.interfaces";
import { plainToInstance, Transform } from "class-transformer";

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

  static build(data: IMateria): MateriaDTO {
    const dto = plainToInstance(MateriaDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
