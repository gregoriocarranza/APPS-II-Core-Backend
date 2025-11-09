import amqplib, { type ConfirmChannel } from "amqplib";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_EXCHANGE = "materias.event";
const DEFAULT_URL = "amqp://guest:guest@localhost:5672";

const exchange =
  process.env.MATERIAS_EXCHANGE?.trim() ||
  process.env.RABBIT_MATERIAS_EXCHANGE?.trim() ||
  DEFAULT_EXCHANGE;

const serviceName =
  process.env.SERVICE_NAME?.trim() ||
  process.env.APP_NAME?.trim() ||
  "core-backend";

const rabbitUrl =
  process.env.RABBIT_URL?.trim() ||
  process.env.RABBITMQ_URL?.trim() ||
  buildUrlFromPieces() ||
  DEFAULT_URL;

let channel: ConfirmChannel | null = null;
let initializingChannel: Promise<ConfirmChannel> | null = null;

function buildUrlFromPieces(): string {
  const user = process.env.RABBITMQ_USER?.trim() ?? "guest";
  const password = process.env.RABBITMQ_PASS?.trim() ?? "guest";
  const host = process.env.RABBITMQ_HOST?.trim() ?? "localhost";
  const port = process.env.RABBITMQ_PORT?.trim() ?? "5672";
  return `amqp://${user}:${password}@${host}:${port}`;
}

async function createChannel(): Promise<ConfirmChannel> {
  const conn = await amqplib.connect(rabbitUrl);

  const handleClose = () => {
    console.warn("[RabbitMQ] Connection closed. Will reconnect on demand.");
    channel = null;
    initializingChannel = null;
  };

  conn.on("close", handleClose);
  conn.on("error", (err: unknown) => {
    console.error("[RabbitMQ] Connection error:", err);
  });

  const ch = await conn.createConfirmChannel();
  channel = ch;

  ch.on("close", () => {
    console.warn("[RabbitMQ] Channel closed. Pending events will reconnect.");
    channel = null;
    initializingChannel = null;
  });

  // await ch.assertExchange(exchange, "topic", {
  //   durable: true,
  //   autoDelete: true,
  // });
  await ch.checkExchange(exchange);
  console.info(`[RabbitMQ] Exchange ready: ${exchange}`);

  return ch;
}

async function getChannel(): Promise<ConfirmChannel> {
  if (channel) {
    return channel;
  }

  if (!initializingChannel) {
    initializingChannel = createChannel().catch((err) => {
      initializingChannel = null;
      throw err;
    });
  }

  return initializingChannel;
}

export async function initRabbit(): Promise<void> {
  await getChannel();
}

export interface DomainEvent<TPayload> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  emittedAt: string;
  sourceModule: string;
  payload: TPayload;
  version: number;
  correlationId?: string;
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
    version: options.version ?? 1,
  };

  if (options.correlationId) {
    event.correlationId = options.correlationId;
  }

  return event;
}

export async function publishDomainEvent<TPayload>(
  routingKey: string,
  event: DomainEvent<TPayload>
): Promise<void> {
  try {
    const ch = await getChannel();
    const body = Buffer.from(JSON.stringify(event));

    ch.publish(exchange, routingKey, body, {
      contentType: "application/json",
      persistent: true,
    });

    await ch.waitForConfirms();
  } catch (err) {
    console.error(
      `[RabbitMQ] Failed to publish ${routingKey}:`,
      err instanceof Error ? err.message : err
    );
  }
}
