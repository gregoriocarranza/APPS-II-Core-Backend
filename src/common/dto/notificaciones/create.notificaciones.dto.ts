import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export enum EmailType {
  HEALTH = "HEALTH",
  INSCRIPCIONES = "INSCRIPCIONES",
}

export class attachmentClass {
  @IsString()
  filename!: string;

  @IsString()
  href!: string;
}

export class NotificationCreatedByTypeDTO {
  @IsUUID()
  user_uuid!: string;

  @IsEnum(EmailType)
  EmailType!: EmailType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => attachmentClass)
  attachments!: attachmentClass[];
}
