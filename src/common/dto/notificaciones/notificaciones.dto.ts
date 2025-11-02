import {
  IsUUID,
  IsString,
  IsOptional,
  validateSync,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Expose, plainToInstance, Type } from "class-transformer";
import { INotificacion } from "../../../database/interfaces/notification/notification.interfaces";
import { attachmentClass } from "./create.notificaciones.dto";

export enum bodyTypes {
  html = "html",
  text = "text",
}
export class NotificationCreatedDTO {
  @Expose({ name: "user_uuid" })
  @IsUUID()
  userUuid!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

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
