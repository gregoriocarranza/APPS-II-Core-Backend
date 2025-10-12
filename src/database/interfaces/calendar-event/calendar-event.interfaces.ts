export interface ICalendarEvent {
  uuid: string;
  title: string;
  description?: string;
  type?: string;
  metadata?: Record<string, any>;
  status: string;
  start_at: string;
  end_at: string;
  user_id: number;
  created_at?: string;
}
