import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsNotEmpty,
  validateSync,
  IsDateString,
} from "class-validator";
import { ICarrera } from "../../../database/interfaces/carrera/carreras.interfaces";
import { plainToInstance, Transform } from "class-transformer";

export enum CarreraModalidadEnum {
  PRESENCIAL = "presencial",
  VIRTUAL = "virtual",
  MIXTA = "mixta",
}

export class CarreraDTO {
  @IsUUID()
  uuid!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  degree_title?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  faculty?: string;

  @IsEnum(CarreraModalidadEnum)
  modality!: CarreraModalidadEnum;

  @IsInt()
  duration_hours!: number;

  @IsInt()
  duration_years!: number;

  @IsBoolean()
  is_active!: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  created_at!: string;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  updated_at!: string;

  static build(data: ICarrera): CarreraDTO {
    const dto = plainToInstance(CarreraDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
