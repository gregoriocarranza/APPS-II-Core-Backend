import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export interface RabbitRetryConfig {
  delayInMs: number;
  maxRetries: number;
}

export interface RabbitQueuesConfig {
  notifications: string;
  backofficeUsers: string;
  deadLetter: string;
}

export interface RabbitConfig {
  url: string;
  prefetch: number;
  reconnectDelayInMs: number;
  retry: RabbitRetryConfig;
  queues: RabbitQueuesConfig;
  deadLetterExchange: string;
}

const defaultUser = process.env.RABBITMQ_DEFAULT_USER ?? "guest";
const defaultPass = process.env.RABBITMQ_DEFAULT_PASS ?? "guest";
const defaultHost = process.env.RABBITMQ_HOST ?? "localhost";
const defaultPort = process.env.RABBITMQ_PORT ?? "5672";

const connectionUrl =
  process.env.RABBITMQ_URL ??
  `amqp://${defaultUser}:${defaultPass}@${defaultHost}:${defaultPort}/`;

const rabbitConfig: RabbitConfig = {
  url: connectionUrl,
  prefetch: parseNumber(process.env.RABBITMQ_PREFETCH, 10),
  reconnectDelayInMs: parseNumber(
    process.env.RABBITMQ_RECONNECT_DELAY_MS,
    5000,
  ),
  retry: {
    delayInMs: parseNumber(process.env.RABBITMQ_RETRY_DELAY_MS, 5000),
    maxRetries: parseNumber(process.env.RABBITMQ_MAX_RETRIES, 5),
  },
  queues: {
    notifications:
      process.env.RABBITMQ_NOTIFICATIONS_QUEUE ?? "core.queue",
    backofficeUsers:
      process.env.RABBITMQ_BACKOFFICE_QUEUE ?? "backoffice.queue",
    deadLetter:
      process.env.RABBITMQ_DEAD_LETTER_QUEUE ?? "dead-letter.queue",
  },
  deadLetterExchange:
    process.env.RABBITMQ_DEAD_LETTER_EXCHANGE ?? "dead-letter.exchanger",
};

export default rabbitConfig;
