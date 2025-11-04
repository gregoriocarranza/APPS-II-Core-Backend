import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID, IsInt } from "class-validator";

export class CarreraResponseDTO {
  @IsUUID("4")
  uuid!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  degree_title?: string | null;

  @IsOptional()
  @IsString()
  code?: string | null;

  @IsOptional()
  @IsString()
  faculty?: string | null;

  @IsEnum(["presencial", "virtual", "mixta"] as any)
  modality!: "presencial" | "virtual" | "mixta";

  @IsInt()
  duration_hours!: number;

  @IsInt()
  duration_years!: number;

  @IsBoolean()
  is_active!: boolean;

  @IsOptional()
  metadata?: Record<string, any> | null;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;
}

export default CarreraResponseDTO;
