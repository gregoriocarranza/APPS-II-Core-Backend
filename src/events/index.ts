import { enumTemplateKey } from "../common/templates";
import { consumeFromQueue } from "../rabbitMq/Consumer";
import { DomainEvent } from "../rabbitMq/Publisher";
import RabbitMQService from "../service/rabbitMq.service";
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
        if (!event.payload.user_id) {
          console.warn(
            `[RabbitMQ] "${routingKey}" no trae el campo user_id para eliminar.`
          );
          throw new Error("payload inválido");
        }
        const userId = event.payload.user_id;
        const resp = await userService.delete(userId);
        console.info(`[RabbitMQ] "${routingKey}" procesado correctamente`, {
          user_id: userId,
          result: resp,
        });

        break;

      case "act.closed":
        await RabbitMQService.handleAcademicEventsNotificationCreated(
          event,
          enumTemplateKey.EVENTOS_ACADEMICOS_ALTA
        );
        break;

      case "reservation.created":
      case "reservation.updated":
        await RabbitMQService.handleReservasNotificationCreated(
          event,
          enumTemplateKey.RESERVA
        );
        break;

      case "grade.created":
      case "grade.update":
        await RabbitMQService.handleGradeNotificationCreated(
          event,
          enumTemplateKey.CARGA_DE_NOTAS
        );
        break;

      case "sanctions.created":
      case "sanctions.updated":
        await RabbitMQService.handleSanctionNotificationCreated(
          event,
          enumTemplateKey.SANCION_BIBLIOTECA
        );
        break;

      case "academic-event.user.suscribed":
        await RabbitMQService.handleAcademicEventsNotificationCreated(
          event,
          enumTemplateKey.EVENTOS_ACADEMICOS_ALTA
        );
        break;

      case "academic-event.user.unsuscribed":
        await RabbitMQService.handleAcademicEventsNotificationCreated(
          event,
          enumTemplateKey.EVENTOS_ACADEMICOS_BAJA
        );
        break;

      default:
        console.warn(
          `[RabbitMQ] No existe handler para routingKey "${routingKey}". Evento ignorado.`
        );
        console.warn(`[RabbitMQ] El eventType vino asi "${event.eventType}".`);
    }
  });
}
