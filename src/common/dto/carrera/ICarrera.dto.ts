// src/dto/carreras/carrera.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsDateString,
  validateSync,
} from "class-validator";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { ICarrera } from "../../../database/interfaces/carrera/carreras.interfaces";
 

export enum CarreraModalityEnum {
  PRESENCIAL = "presencial",
  VIRTUAL = "virtual",
  MIXTA = "mixta",
}

export class ICarreraDTO implements ICarrera {
  @IsUUID()
  @Expose()
  uuid!: string;

  @IsString()
  @Expose()
  name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string | null;

  @IsOptional()
  @IsString()
  @Expose({ name: "degree_title" })
  degree_title?: string | null;

  @IsOptional()
  @IsString()
  @Expose()
  code?: string | null;

  @IsOptional()
  @IsString()
  @Expose()
  faculty?: string | null;

  @IsEnum(CarreraModalityEnum)
  @Expose()
  modality!: "presencial" | "virtual" | "mixta";

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose()
  duration_hours!: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose()
  duration_years!: number;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @Expose({ name: "is_active" })
  is_active!: boolean;

  @IsOptional()
  @Expose()
  metadata?: Record<string, any> | null;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @Expose()
  created_at!: string;

  @IsDateString()
  @Transform(({ value }) => new Date().toISOString())
  @Expose()
  updated_at!: string;

  static build(data: any): ICarreraDTO {
    const dto = plainToInstance(ICarreraDTO, data, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error(
        `CarreraDTO validation failed: ${JSON.stringify(errors)}`
      );
    }

    return dto;
  }
}
