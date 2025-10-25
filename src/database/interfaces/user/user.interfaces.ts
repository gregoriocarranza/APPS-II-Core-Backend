export interface IUser {
  uuid: string;
  nombre: string;
  apellido: string;
  legajo: string;
  dni: number;
  email: string; // usarel correo_personal que viene desde backofice
  telefono_personal: string;
  status: "activo" | "inactivo" | "suspendido";
  rol: string;
  carrera_uuid: string | null;
  fecha_alta: string;
}
