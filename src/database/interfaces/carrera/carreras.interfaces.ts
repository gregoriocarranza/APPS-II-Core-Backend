export interface ICarrera {
  uuid: string;
  name: string;
  description?: string | null;
  degree_title?: string | null;
  code?: string | null;
  faculty?: string | null;
  modality: "presencial" | "virtual" | "mixta";
  duration_hours: number;
  duration_years: number;
  is_active: boolean;
  metadata?: Record<string, any> | null;
  created_at: Date | string;
  updated_at: Date | string;
}
