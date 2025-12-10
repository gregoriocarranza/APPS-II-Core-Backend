import dotenv from "dotenv";
dotenv.config();

export enum EXCHANGES {
  CURSO = "curso.event",
  CARRERA = "carrera.event",
  MATERIA = "materia.event",
  ENROLLMENT = "enrollment.event",
  TRANSACTION = "transaction.event",
  NOTIFICATION = "notification.event",
}

export const ALL_EXCHANGES: string[] = Object.values(EXCHANGES);

export const rabbitUrl = buildUrlFromPieces();
export const QUEUE_NAME = getQueueName();

function buildUrlFromPieces(): string {
  const user = process.env.RABBITMQ_USER?.trim();
  const password = process.env.RABBITMQ_PASS?.trim();
  const host = process.env.RABBITMQ_HOST?.trim();
  const port = process.env.RABBITMQ_PORT?.trim();

  if (!user || !password || !host || !port)
    throw new Error("RabbitMQ configuration variables are not fully set.");

  return `amqp://${user}:${password}@${host}:${port}`;
}

function getQueueName(): string {
  const name = process.env.RABBITMQ_QUEUE?.trim();

  if (!name)
    throw new Error("RabbitMQ queue name is not set. Define RABBITMQ_QUEUE .");

  return name;
}
