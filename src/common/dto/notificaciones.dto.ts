import { INotificacion } from "../../database/interfaces/notification/notification.interfaces";

export class NotificationCreatedDTO {
  user_id: number;
  title: string;
  body: string;
  from: string;

  constructor(data: NotificationCreatedDTO) {
    this.user_id = data.user_id;
    this.title = data.title;
    this.body = data.body;
    this.from = data.from;
  }
}

export class NotificationResponseDTO {
  uuid: string;
  user_id: number;
  title: string;
  body: string;
  from: string;
  created_at: string;

  constructor(data: INotificacion) {
    this.uuid = data.uuid;
    this.user_id = data.user_id;
    this.title = data.title;
    this.body = data.body;
    this.from = data.from;
    this.created_at = data.created_at || new Date().toISOString();
  }
}
