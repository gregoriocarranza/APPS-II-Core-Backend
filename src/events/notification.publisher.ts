import { EXCHANGES } from "../common/config/rabbitMq/config";
import { INotificacion } from "../database/interfaces/notification/notification.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";

export async function emitnotificationCreated(
  notification: INotificacion
): Promise<void> {
  const { body, ...data } = notification;
  const event = buildDomainEvent("notification.created", data);
  await publishDomainEvent(
    EXCHANGES.NOTIFICATION,
    "notification.created",
    event
  );
}
