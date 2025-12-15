import {
  IsNumber,
  IsString,
  IsOptional,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  validateSync,
  IsEnum,
} from "class-validator";
import { plainToInstance, Type } from "class-transformer";
import { transferTypeEnum } from "./ITransfer.dto";

@ValidatorConstraint({ name: "isUUIDOrSystem", async: false })
class IsUUIDOrSystemConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value !== "string") return false;
    if (value === "SYSTEM") return true;

    // UUID v1–v5
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid UUID or "SYSTEM"`;
  }
}

export class TransferCreateDTO {
  @Validate(IsUUIDOrSystemConstraint)
  from!: string;

  @Validate(IsUUIDOrSystemConstraint)
  to!: string;

  @IsString()
  currency!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @IsEnum(transferTypeEnum)
  type?: transferTypeEnum;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  static build(data: any): TransferCreateDTO {
    const dto = plainToInstance(TransferCreateDTO, data, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
    return dto;
  }
}
