import { INotificacion } from "../../database/interfaces/notification/notification.interfaces";

export class NotificationCreatedDTO {
  user_id: number;
  title: string;
  bodyType: "html" | "text";
  body: string;

  constructor(data: NotificationCreatedDTO) {
    this.user_id = data.user_id;
    this.title = data.title;
    this.bodyType = data.bodyType;
    this.body = data.body;
  }
}

export class NotificationResponseDTO {
  uuid: string;
  user_id: number;
  title: string;
  body: string;
  created_at: string;

  constructor(data: INotificacion) {
    this.uuid = data.uuid;
    this.user_id = data.user_id;
    this.title = data.title;
    this.body = data.body;
    this.created_at = data.created_at || new Date().toISOString();
  }
}
