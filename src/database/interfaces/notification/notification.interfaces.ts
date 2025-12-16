import { notificationStatusEnum } from "../../../common/dto/notificaciones/Inotificaciones.dto";

export interface INotificacion {
  uuid: string;
  user_uuid: string;
  title: string;
  status: notificationStatusEnum;
  body: string;
  metadata?: Record<string, any> | null;
  created_at?: string;
}
