export interface IUser {
  subrol: any;
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

export interface IUserDTO {
  uuid: string;
  nombre: string;
  apellido: string;
  legajo: string;
  dni: number;
  email: string;
  telefono_personal?: string;
  status: string;
  rol: string;
  carrera_uuid?: string | null;
  fecha_alta: string;
  created_at?: string;
  updated_at?: string;
}


export interface IBackoficeAuthRole {
  id_rol: string;
  descripcion: string;
  categoria: string;
  subcategoria: string;
}

export interface IBackoficeAuthResponse {
  id_usuario: string;
  nombre: string;
  apellido: string;
  legajo: string;
  dni: string;
  email_institucional: string;
  rol: IBackoficeAuthRole;
}
