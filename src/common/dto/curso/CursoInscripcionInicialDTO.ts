import { IsUUID, IsEnum, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";
import { InscripcionEstadoEnum } from "../../../database/interfaces/inscripciones/inscripciones.interfaces";

export enum RolInicialEnum {
  TITULAR = "TITULAR",
  AUXILIAR = "AUXILIAR",
}

export class CursoInscripcionInicialDTO {
  @IsUUID()
  user_uuid!: string;

  @IsEnum(RolInicialEnum)
  rol!: RolInicialEnum;

  @IsEnum(InscripcionEstadoEnum)
  estado: InscripcionEstadoEnum = InscripcionEstadoEnum.CONFIRMADA;

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
