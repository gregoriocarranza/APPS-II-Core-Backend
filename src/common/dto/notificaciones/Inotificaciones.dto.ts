import {
  IsUUID,
  IsString,
  validateSync,
  IsDateString,
  IsOptional,
} from "class-validator";
import { Expose, plainToInstance, Transform } from "class-transformer";
import { INotificacion } from "../../../database/interfaces/notification/notification.interfaces";

export enum MateriaApprovalMethodEnum {
  FINAL = "final",
  PROMOCION = "promocion",
  TRABAJO_PRACTICO = "trabajo_practico",
}

export class INotificacionDTO implements INotificacion {
  @IsUUID()
  uuid!: string;

  @Expose()
  @IsUUID()
  user_uuid!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @Transform(({ value }) => new Date(value || Date.now()).toISOString())
  @IsDateString()
  @IsOptional()
  created_at!: string;

  static build(data: any): INotificacionDTO {
    const dto = plainToInstance(INotificacionDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
