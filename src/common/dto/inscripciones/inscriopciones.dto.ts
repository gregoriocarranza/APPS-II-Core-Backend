import {
  IsUUID,
  IsString,
  IsOptional,
  IsDateString,
  validateSync,
} from "class-validator";
import { plainToInstance, Transform } from "class-transformer";
import { CursoDTO } from "../curso/curso.dto";
import { ICursoDTO } from "../../../database/interfaces/cursos/cursos.interfaces";
import { IUserDTO } from "../../../database/interfaces/user/user.interfaces";
import { IInscripcionDTO } from "../../../database/interfaces/inscripciones/inscripciones.interfaces";
import { ToUserDTO } from "../users/user.dto";

export class ToInscripcionDTO {
  @IsUUID()
  uuid!: string;

  @IsUUID()
  uuid_curso!: string;

  @IsUUID()
  user_uuid!: string;

  @IsOptional()
  curso!: ICursoDTO;

  @IsOptional()
  user!: IUserDTO;

  @IsString()
  estado!: string;

  @IsString()
  rol!: string;

  @IsOptional()
  @IsString()
  razon?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  @IsDateString()
  fecha_baja?: string | null;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  created_at!: string;

  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  updated_at!: string;

  static build(data: IInscripcionDTO): ToInscripcionDTO {
    const dto = plainToInstance(ToInscripcionDTO, data, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(dto, { whitelist: true });
    if (errors.length > 0) throw new Error(JSON.stringify(errors));

    if (data.curso) dto.curso = CursoDTO.build(data.curso);
    if (data.user) dto.user = ToUserDTO.build(data.user);

    return dto;
  }
}
