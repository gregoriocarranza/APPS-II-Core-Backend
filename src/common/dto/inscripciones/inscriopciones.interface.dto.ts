import {
  IsUUID,
  IsString,
  IsOptional,
  IsDateString,
  validateSync,
} from "class-validator";
import { plainToInstance, Transform } from "class-transformer";
import { IInscripcionCreated } from "../../../database/interfaces/inscripciones/inscripciones.interfaces";

export class ToIInscripcionesDTO {
  @IsUUID()
  uuid_curso!: string;

  @IsUUID()
  user_uuid!: string;

  @IsString()
  estado!: string;

  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  rol!: string;

  @IsOptional()
  @IsString()
  razon?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  @IsDateString()
  fecha_baja?: string | null;

  static build(data: IInscripcionCreated): ToIInscripcionesDTO {
    const dto = plainToInstance(ToIInscripcionesDTO, data, {
      enableImplicitConversion: true,
    });

    if (dto.fecha_baja === undefined) {
      dto.fecha_baja = null;
    }

    const errors = validateSync(dto);
    if (errors.length > 0) throw new Error(JSON.stringify(errors));

    return dto;
  }
}
