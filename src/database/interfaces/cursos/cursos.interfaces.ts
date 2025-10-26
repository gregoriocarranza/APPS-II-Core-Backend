import { ICarrera } from "../carrera/carreras.interfaces";
import { IMateria } from "../materia/materia.interfaces";

export interface ICurso {
  uuid: string;
  uuid_materia: string;
  examen: string;
  comision: string;
  modalidad: string;
  sede: string;
  aula: string;
  periodo: string;
  turno: string;
  estado: string;
  cantidad_max: number;
  cantidad_min: number;
  desde: string;
  hasta: string;
  created_at: string;
  updated_at: string;
}

export interface ICursoDTO {
  uuid: string;
  uuid_materia: string;
  materia: IMateria;
  examen: string;
  comision: string;
  modalidad: string;
  sede: string;
  aula: string;
  periodo: string;
  turno: string;
  estado: string;
  cantidad_max: number;
  cantidad_min: number;
  desde: string;
  hasta: string;
  carrera: ICarrera;
  created_at: string;
  updated_at: string;
}
