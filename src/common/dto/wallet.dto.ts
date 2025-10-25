import { IsUUID, IsString } from "class-validator";

export class WalletCreatedDTO {
  @IsUUID("4", { message: "user_uuid debe ser un UUID válido" })
  user_uuid!: string;
  @IsString({ message: "currency debe ser un string (ISO-4217)" })
  currency!: string;
}
