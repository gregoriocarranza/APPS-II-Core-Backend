import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export enum JwtKind {
  ACCESS = "access",
  REFRESH = "refresh",
}

export class VerifyJwtDTO {
  @IsEnum(JwtKind, {
    message: "kind debe ser 'access' o 'refresh'",
  })
  @IsNotEmpty()
  kind!: JwtKind;

  @IsString()
  @IsNotEmpty()
  token?: string;
}
