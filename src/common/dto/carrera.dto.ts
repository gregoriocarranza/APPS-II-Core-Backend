import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from "class-validator";

export enum ModalityEnum {
  presencial = "presencial",
  virtual = "virtual",
  mixta = "mixta",
}

export class CarreraCreateDTO {
  @IsOptional()
  @IsUUID()
  uuid?: string;

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

  @IsEnum(ModalityEnum)
  modality!: ModalityEnum;

  @IsInt()
  duration_hours!: number;

  @IsInt()
  duration_years!: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;


  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
