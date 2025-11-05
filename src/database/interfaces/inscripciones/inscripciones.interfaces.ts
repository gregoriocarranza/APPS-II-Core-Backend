import { ICursoDTO } from "../cursos/cursos.interfaces";
import { IUser } from "../user/user.interfaces";

export enum InscripcionEstadoEnum {
  PENDIENTE = "PENDIENTE",
  CONFIRMADA = "CONFIRMADA",
  BAJA = "BAJA",
}

export enum InscripcionRolEnum {
  ALUMNO = "ALUMNO",
  TITULAR = "TITULAR",
  AUXILIAR = "AUXILIAR",
}

export interface IInscripcion {
  uuid: string;
  uuid_curso: string;
  user_uuid: string;
  estado: string;
  rol: string;
  razon: string;
  fecha_baja: string | null;
  created_at: string;
  updated_at: string;
}

export interface IInscripcionCreated {
  uuid: string;
  uuid_curso: string;
  user_uuid: string;
  estado: string;
  rol: string;
}

export interface IInscripcionDTO {
  uuid: string;
  uuid_curso: string;
  user_uuid: string;
  curso: ICursoDTO;
  user: IUser;
  estado: "pendiente" | "confirmada" | "baja";
  rol: "ALUMNO" | "TITULAR" | "AUXILIAR";
  razon: string;
  fecha_baja?: string | null;
  created_at: string;
  updated_at: string;
}
