export interface INotificacion {
  uuid: string;
  user_id: number;
  title: string;
  body: string;
  created_at?: string;
}

export interface ICreateNotificationDTO {
  user_id: number;
  title: string;
  bodyType: "html" | "text";
  body: string;
  attachments: attachment;
}

export interface attachment {
  filename: string;
  href: string;
}
