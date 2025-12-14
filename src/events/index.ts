import { consumeFromQueue } from "../rabbitMq/Consumer";
import { DomainEvent } from "../rabbitMq/Publisher";
import userService from "../service/user.service";

export async function startEventConsumers(): Promise<void> {
  await consumeFromQueue<DomainEvent<any>>(async (event, msg) => {
    const routingKey = msg.fields.routingKey;
    console.log("[RabbitMQ] routingKey recibido:", routingKey);
    console.log("[RabbitMQ] eventType recibido:", event.eventType);
    console.log(event);

    switch (routingKey) {
      case "user.created":
        await userService.handleUserCreated(event);
        break;

      case "user.deleted":
        if (event.payload.user_id)
          console.warn(
            `[RabbitMQ] "${routingKey}" no trae el campo user_id para eliminar.`
          );
        await userService.delete(event.payload.user_id);
        break;

      case "academic-event.user.suscribed":
        await userService.handleUserCreated(event);
        break;

      default:
        console.warn(
          `[RabbitMQ] No existe handler para routingKey "${routingKey}". Evento ignorado.`
        );
        console.warn(`[RabbitMQ] El eventType vino asi "${event.eventType}".`);
    }
  });
}
