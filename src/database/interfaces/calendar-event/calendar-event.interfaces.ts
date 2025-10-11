export interface ICalendarEvent {
  uuid: string;
  title: string;
  description?: string;
  type?: string;
  location?: string;
  capacity?: number;
  start_at: string;
  end_at: string;
  created_by: string;
  created_at?: string;
}
