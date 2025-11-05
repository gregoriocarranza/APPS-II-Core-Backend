import { IsUUID, IsEnum, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

export enum RolInicialEnum {
  TITULAR = "TITULAR",
  AUXILIAR = "AUXILIAR",
}

export enum EstadoInicialEnum {
  PENDIENTE = "pendiente",
  CONFIRMADA = "confirmada",
  BAJA = "baja",
}

export class CursoInscripcionInicialDTO {
  @IsUUID()
  user_uuid!: string;

  @IsEnum(RolInicialEnum)
  rol!: RolInicialEnum;

  @IsEnum(EstadoInicialEnum)
  estado: EstadoInicialEnum = EstadoInicialEnum.CONFIRMADA;

  static build(data: any[]): CursoInscripcionInicialDTO[] {
    const dtos = plainToInstance(CursoInscripcionInicialDTO, data, {
      enableImplicitConversion: true,
    });

    for (const dto of dtos) {
      const errors = validateSync(dto);
      if (errors.length > 0) throw new Error(JSON.stringify(errors));
    }

    return dtos;
  }
}
