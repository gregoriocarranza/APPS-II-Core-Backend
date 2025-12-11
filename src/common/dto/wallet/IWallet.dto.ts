import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  validateSync,
} from "class-validator";
import { Expose, Transform, plainToInstance } from "class-transformer";
import {
  IWallet,
  WalletStatus,
} from "../../../database/interfaces/wallet/wallet.interfaces";

export class IWalletDTO implements IWallet {
  @IsUUID()
  @Expose()
  uuid!: string;

  @IsUUID()
  @Expose()
  user_uuid!: string;

  @IsString()
  @Expose()
  @Transform(({ value }) => (value ? String(value).toUpperCase() : "ARG"))
  currency!: string;

  @IsNumber()
  @Expose()
  @Transform(({ value }) => (value ? Number(value) : 0))
  balance!: number;

  @IsEnum(WalletStatus)
  @Expose()
  @Transform(({ value }) => (value == null ? WalletStatus.ACTIVE : value))
  status!: WalletStatus;

  @IsOptional()
  @IsDateString()
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : value))
  last_activity_at?: string | null;

  @IsOptional()
  @IsDateString()
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : value))
  created_at?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : value))
  updated_at?: string;

  static build(data: any): IWalletDTO {
    const dto = plainToInstance(IWalletDTO, data, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error(`WalletDTO validation failed: ${JSON.stringify(errors)}`);
    }

    return dto;
  }
}
