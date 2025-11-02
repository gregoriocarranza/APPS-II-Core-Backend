export interface IInscripcion {
  uuid: string;
  uuid_curso: string;
  uuid_alumno: string;
  estado: string;
  rol: string;
  razon: string;
  fecha_baja: string | null;
  created_at: string;
  updated_at: string;
}
