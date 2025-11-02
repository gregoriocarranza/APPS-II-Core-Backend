import dotenv from "dotenv";
import "reflect-metadata";
import RabbitMQClient from "./messaging/rabbitmq.client";
import { NotificationsConsumer } from "./messaging/consumers/notifications.consumer";
import { BackofficeUsersConsumer } from "./messaging/consumers/users.consumer";
import KnexManager from "./database/KnexConnection";

dotenv.config();

const rabbitClient = RabbitMQClient.instance;
let shuttingDown = false;

const consumers = [new NotificationsConsumer(), new BackofficeUsersConsumer()];

async function bootstrap(): Promise<void> {
  try {
    await KnexManager.connect();
    await rabbitClient.connect();

    await Promise.all(consumers.map((consumer) => consumer.start()));

    console.info("[Worker] RabbitMQ consumers initialised");
    setupSignalHandlers();
  } catch (err) {
    console.error("[Worker] Failed to bootstrap worker", err);
    await gracefulShutdown(1);
  }
}

function setupSignalHandlers(): void {
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
  signals.forEach((signal) => {
    process.on(signal, () => {
      void gracefulShutdown(0, signal);
    });
  });

  process.on("uncaughtException", (err) => {
    console.error("[Worker] Uncaught exception", err);
    void gracefulShutdown(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("[Worker] Unhandled promise rejection", reason);
    void gracefulShutdown(1);
  });
}

async function gracefulShutdown(
  exitCode: number,
  signal?: NodeJS.Signals,
): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  if (signal) {
    console.info(`[Worker] Received ${signal}. Gracefully shutting down...`);
  }

  try {
    consumers.forEach((consumer) => {
      console.info(
        `[Worker] Detaching consumer for queue "${consumer.getQueueName()}"`,
      );
    });
    await rabbitClient.close();
  } catch (err) {
    console.error("[Worker] Error while closing RabbitMQ connection", err);
  }

  try {
    await KnexManager.disconnect();
  } catch (err) {
    console.error("[Worker] Error while disconnecting database", err);
  } finally {
    process.exit(exitCode);
  }
}

void bootstrap();
