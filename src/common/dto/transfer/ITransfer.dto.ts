// src/dto/transfers/transfer.dto.ts
import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  validateSync,
  IsEnum,
} from "class-validator";
import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import { ITransfer } from "../../../database/interfaces/transfer/transfer.interface";
import { TransferCreateDTO } from "./create.transfer.dto";

export enum transferTypeEnum {
  COMPRA = "COMPRA",
  CARGA_DE_SALDO = "CARGA_DE_SALDO",
  SANCION = "SANCION",
  RESERVA = "RESERVA",
  CANCELACION_RESERVA = "CANCELACION_RESERVA",
  INSCRIPCION_EVENTO = "INSCRIPCION_EVENTO",
  DESINSCRIPCION_EVENTO = "DESINSCRIPCION_EVENTO",
}
export class ITransferDTO implements ITransfer {
  @IsUUID()
  uuid!: string;

  @Expose({ name: "from" })
  @IsUUID()
  from_wallet_uuid!: string | null;

  @Expose({ name: "to" })
  @IsUUID()
  to_wallet_uuid!: string | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @IsString()
  currency!: string;

  @IsString()
  @IsEnum(transferTypeEnum)
  type!: transferTypeEnum;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  reference?: string | null;

  @IsOptional()
  metadata?: Record<string, any> | null;

  @Transform(({ value }) =>
    value ? new Date(value).toISOString() : new Date().toISOString()
  )
  @IsDateString()
  processed_at!: string;

  static build(data: TransferCreateDTO | any): ITransferDTO {
    const dto = plainToInstance(
      ITransferDTO,
      {
        uuid: uuidv4(),
        ...data,
        status: data.status ?? "completed",
        processed_at: new Date().toISOString(),
      },
      { enableImplicitConversion: true }
    );

    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
