import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";

export enum bodyTypes {
  html = "html",
  text = "text",
}
export class attachmentClass {
  @IsString()
  filename!: string;

  @IsString()
  href!: string;
}

export class NotificationCreatedDTO {
  @IsInt()
  user_id!: number;

  @IsString()
  title!: string;

  @IsEnum(bodyTypes)
  bodyType!: bodyTypes;

  @IsString()
  body!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => attachmentClass)
  attachments!: attachmentClass[];
}
