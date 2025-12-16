import {
  IsUUID,
  IsString,
  IsOptional,
  validateSync,
  ValidateNested,
  IsArray,
  IsEnum,
} from "class-validator";
import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { INotificacion } from "../../../database/interfaces/notification/notification.interfaces";
import { attachmentClass } from "./create.notificaciones.dto";
import { notificationStatusEnum } from "./Inotificaciones.dto";

export enum bodyTypes {
  html = "html",
  text = "text",
}
export class NotificationCreatedDTO {
  @Expose()
  @IsUUID()
  user_uuid!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsEnum(notificationStatusEnum)
  @Transform(({ value }) => value?.toUpperCase())
  status!: notificationStatusEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => attachmentClass)
  attachments!: attachmentClass[];

  static build(data: INotificacion): NotificationCreatedDTO {
    const dto = plainToInstance(NotificationCreatedDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
