// src/dto/materias/materia.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  validateSync,
} from "class-validator";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { IMateria } from "../../../database/interfaces/materia/materia.interfaces";

export enum MateriaApprovalMethodEnum {
  FINAL = "final",
  PROMOCION = "promocion",
  TRABAJO_PRACTICO = "trabajo_practico",
}

export class IMateriaDTO implements IMateria {
  @IsUUID()
  @Expose()
  uuid!: string;

  @IsString()
  @Expose()
  nombre!: string;

  @IsUUID()
  @Expose({ name: "uuid_carrera" })
  uuid_carrera!: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string | null;

  @IsEnum(MateriaApprovalMethodEnum)
  @Expose()
  approval_method!: "final" | "promocion" | "trabajo_practico";

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @Expose()
  is_elective!: boolean;

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

  static build(data: any): IMateriaDTO {
    const dto = plainToInstance(IMateriaDTO, data, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error(
        `MateriaDTO validation failed: ${JSON.stringify(errors)}`
      );
    }

    return dto;
  }
}
