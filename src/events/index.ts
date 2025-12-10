import { consumeFromQueue } from "../rabbitMq/Consumer";
import { DomainEvent } from "../rabbitMq/Publisher";
import userService from "../service/user.service";
import { IUser } from "../database/interfaces/user/user.interfaces";

export async function startEventConsumers(): Promise<void> {
  await consumeFromQueue<DomainEvent<IUser>>(async (event) => {
    console.log("[RabbitMQ] Evento recibido:", event.eventType);
    console.log(event);

    switch (event.eventType) {
      case "user.created":
        await userService.handleUserCreated(event);
        break;

      default:
        console.warn(
          `[RabbitMQ] No existe handler para eventType "${event.eventType}". Evento ignorado.`
        );
    }
  });
}
