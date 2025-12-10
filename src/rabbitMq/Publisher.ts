import { v4 as uuidv4 } from "uuid";
import { ensureExchange, getChannel } from "./RabbitMq.utils";

const serviceName =
  process.env.SERVICE_NAME?.trim() ||
  process.env.APP_NAME?.trim() ||
  "core-backend";

export interface DomainEvent<TPayload> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  emittedAt: string;
  sourceModule: string;
  payload: TPayload;
}

interface BuildDomainEventOptions {
  correlationId?: string;
  occurredAt?: Date;
  version?: number;
}

export function buildDomainEvent<TPayload>(
  eventType: string,
  payload: TPayload,
  options: BuildDomainEventOptions = {}
): DomainEvent<TPayload> {
  const occurredAt = options.occurredAt ?? new Date();
  const event: DomainEvent<TPayload> = {
    eventId: uuidv4(),
    eventType,
    occurredAt: occurredAt.toISOString(),
    emittedAt: new Date().toISOString(),
    sourceModule: serviceName,
    payload,
  };

  return event;
}

export async function publishDomainEvent<TPayload>(
  exchangeName: string,
  routingKey: string,
  event: DomainEvent<TPayload>
): Promise<void> {
  try {
    await ensureExchange(exchangeName);
    const ch = await getChannel();
    const body = Buffer.from(JSON.stringify(event));

    ch.publish(exchangeName, routingKey, body, {
      contentType: "application/json",
      persistent: true,
    });

    await ch.waitForConfirms();
  } catch (err) {
    console.error(
      `[RabbitMQ] Failed to publish ${routingKey} on ${exchangeName}:`,
      err instanceof Error ? err.message : err
    );
  }
}
