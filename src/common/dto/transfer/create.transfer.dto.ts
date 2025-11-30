import { IsNumber, IsString, IsUUID, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class TransferCreateDTO {
  @IsUUID()
  from!: string;

  @IsUUID()
  to!: string;

  @IsString()
  currency!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
