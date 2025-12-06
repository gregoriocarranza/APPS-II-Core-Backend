import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  IsArray,
} from "class-validator";
import { MateriaApprovalMethodEnum } from "./materia.dto";

export class MateriaCreateDTO {
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

  @IsOptional()
  @IsBoolean()
  is_elective?: boolean = false;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  correlativas?: string[];
}
