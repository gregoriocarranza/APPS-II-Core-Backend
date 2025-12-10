import { ConsumeMessage } from "amqplib";
import { getChannel } from "./RabbitMq.utils";
import { QUEUE_NAME } from "../common/config/rabbitMq/config";

type QueueMessageHandler<T = unknown> = (
  payload: T,
  msg: ConsumeMessage
) => Promise<void> | void;

export async function consumeFromQueue<T = unknown>(
  handler: QueueMessageHandler<T>
): Promise<void> {
  const ch = await getChannel();

  await ch.consume(
    QUEUE_NAME,
    async (msg) => {
      if (!msg) return;

      try {
        const content = msg.content.toString("utf8");
        const payload = JSON.parse(content) as T;

        await handler(payload, msg);

        ch.ack(msg);
      } catch (err) {
        console.error(
          `[RabbitMQ] Error procesando mensaje de "${QUEUE_NAME}":`,
          err instanceof Error ? err.message : err
        );

        ch.nack(msg, false, false);
      }
    },
    {
      noAck: false,
    }
  );

  console.info(`[RabbitMQ] Consumidor registrado en queue "${QUEUE_NAME}"`);
}
