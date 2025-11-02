import { ConsumeMessage } from "amqplib";
import rabbitConfig from "../config/rabbit.config";
import RabbitMQClient from "./rabbitmq.client";

export abstract class BaseConsumer<TMessage> {
  protected constructor(
    protected readonly queueName: string,
    protected readonly client: RabbitMQClient = RabbitMQClient.instance,
  ) {}

  async start(): Promise<void> {
    await this.client.assertQueue(this.queueName, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": rabbitConfig.deadLetterExchange,
      },
    });
    await this.client.consume(this.queueName, async (message) => {
      await this.handleMessage(message);
    });
  }

  protected abstract onMessage(
    payload: TMessage,
    message: ConsumeMessage,
  ): Promise<void>;

  protected parseMessage(message: ConsumeMessage): TMessage {
    try {
      return JSON.parse(message.content.toString("utf-8")) as TMessage;
    } catch (err) {
      throw new Error(
        `Failed to parse message on queue "${this.queueName}": ${String(err)}`,
      );
    }
  }

  protected get maxRetries(): number {
    return rabbitConfig.retry.maxRetries;
  }

  protected get retryDelayInMs(): number {
    return rabbitConfig.retry.delayInMs;
  }

  public getQueueName(): string {
    return this.queueName;
  }

  private async handleMessage(message: ConsumeMessage): Promise<void> {
    try {
      const payload = this.parseMessage(message);
      await this.onMessage(payload, message);
      this.client.ack(message);
    } catch (err) {
      await this.handleProcessingError(message, err as Error);
    }
  }

  private async handleProcessingError(
    message: ConsumeMessage,
    error: Error,
  ): Promise<void> {
    const currentRetries = this.extractRetryCount(message);
    console.error(
      `[RabbitMQ] Error processing "${this.queueName}" (retry #${currentRetries}):`,
      error,
    );

    if (currentRetries >= this.maxRetries) {
      console.warn(
        `[RabbitMQ] Max retries reached for "${this.queueName}". Sending to DLX.`,
      );
      this.client.nack(message, false, false);
      return;
    }

    const nextRetryCount = currentRetries + 1;
    const headers = {
      ...(message.properties.headers ?? {}),
      "x-retry-count": nextRetryCount,
    };

    await this.delay(this.retryDelayInMs);
    const publishResult = await this.client.publish(
      this.queueName,
      message.content,
      {
        headers,
        contentType: message.properties.contentType,
        contentEncoding: message.properties.contentEncoding,
        correlationId: message.properties.correlationId,
        replyTo: message.properties.replyTo,
        expiration: message.properties.expiration,
        messageId: message.properties.messageId,
        timestamp: message.properties.timestamp,
        type: message.properties.type,
        appId: message.properties.appId,
      },
    );

    console.info(
      `[RabbitMQ] Requeued message on "${this.queueName}" (retry #${nextRetryCount}).`,
    );
    if (!publishResult) {
      console.warn(
        `[RabbitMQ] Publish returned false (queue "${this.queueName}"). ` +
          "The broker sent a backpressure signal, but the message was enqueued.",
      );
    }
    this.client.ack(message);
  }

  private extractRetryCount(message: ConsumeMessage): number {
    const headerValue = message.properties.headers?.["x-retry-count"];
    if (typeof headerValue === "number") return headerValue;
    const parsed = Number(headerValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async delay(ms: number): Promise<void> {
    if (ms <= 0) return;
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default BaseConsumer;
