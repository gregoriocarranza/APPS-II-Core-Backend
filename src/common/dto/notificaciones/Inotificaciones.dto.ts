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
  @Expose()
  uuid!: string;

  @Expose()
  @IsUUID()
  user_uuid!: string;

  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @Expose()
  body!: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(notificationStatusEnum)
  @Expose()
  status!: notificationStatusEnum;

  @IsOptional()
  @Expose()
  @Transform(({ value }) => value, { toClassOnly: true })
  metadata?: Record<string, any> | null;

  @Transform(({ value }) => new Date(value || Date.now()).toISOString())
  @IsDateString()
  @IsOptional()
  @Expose()
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
        excludeExtraneousValues: true,
      }
    );

    dto.metadata = data.metadata ?? null;

    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
