export interface INotificacion {
  uuid: string;
  user_id: number;
  title: string;
  body: string;
  from: string;
  created_at?: string;
}

export interface ICreateNotificationDTO {
  user_id: number;
  title: string;
  body: string;
  from: string;
}