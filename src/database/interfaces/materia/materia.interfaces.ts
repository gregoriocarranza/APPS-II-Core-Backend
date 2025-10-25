export interface IMateria {
  uuid: string;
  nombre: string;
  uuid_carrera: string;
  description?: string | null;
  approval_method: "final" | "promocion" | "trabajo_practico";
  is_elective: boolean;
  metadata?: Record<string, any> | null;
  created_at: Date | string;
  updated_at: Date | string;
}
