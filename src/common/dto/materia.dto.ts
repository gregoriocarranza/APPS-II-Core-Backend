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

export enum ApprovalMethodEnum {
  final = "final",
  promocion = "promocion",
  trabajo_practico = "trabajo_practico",
}

export class MateriaCreateDTO {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsUUID()
  uuid_carrera!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ApprovalMethodEnum)
  approval_method!: ApprovalMethodEnum;

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
