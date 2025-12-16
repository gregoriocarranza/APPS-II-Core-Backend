import {
  IsUUID,
  IsString,
  validateSync,
  IsDateString,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Expose, plainToInstance, Transform } from "class-transformer";
import { INotificacion } from "../../../database/interfaces/notification/notification.interfaces";

export enum MateriaApprovalMethodEnum {
  FINAL = "final",
  PROMOCION = "promocion",
  TRABAJO_PRACTICO = "trabajo_practico",
}

export enum notificationStatusEnum {
  NEW = "NEW",
  OPENED = "OPENED",
  HIDDEN = "HIDDEN",
  DELETED = "DELETED",
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

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(notificationStatusEnum)
  status!: notificationStatusEnum;

  @Transform(({ value }) => new Date(value || Date.now()).toISOString())
  @IsDateString()
  @IsOptional()
  created_at!: string;

  static build(data: any): INotificacionDTO {
    const dto = plainToInstance(
      INotificacionDTO,
      {
        ...data,
        status: data.status || notificationStatusEnum.NEW,
      },
      {
        enableImplicitConversion: true,
      }
    );
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
