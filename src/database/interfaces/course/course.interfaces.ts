export type ExamType = "partial" | "makeup" | "final";

export interface ICourse {
  id?: number;
  uuid: string;
  subject_id: string;
  start_date: string;
  end_date: string;
  exam_type: ExamType;
  max_capacity: number;
  created_at?: string;
}
