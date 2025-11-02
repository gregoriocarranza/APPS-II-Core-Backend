import {
  Channel,
  ChannelModel,
  ConsumeMessage,
  Options,
  connect,
} from "amqplib";
import rabbitConfig from "../config/rabbit.config";

type ConsumeHandler = (msg: ConsumeMessage) => Promise<void>;

interface RegisteredConsumer {
  queue: string;
  handler: ConsumeHandler;
  options?: Options.Consume;
}

export class RabbitMQClient {
  private static _instance: RabbitMQClient;

  private connection?: ChannelModel;
  private channel?: Channel;
  private connecting?: Promise<Channel>;
  private consumers: RegisteredConsumer[] = [];
  private reconnectTimeout?: NodeJS.Timeout;

  private constructor() {}

  static get instance(): RabbitMQClient {
    if (!this._instance) {
      this._instance = new RabbitMQClient();
    }
    return this._instance;
  }

  private async createChannel(): Promise<Channel> {
    const connection = await connect(rabbitConfig.url);
    this.connection = connection;

    connection.on("close", () => {
      console.warn("[RabbitMQ] Connection closed");
      this.handleConnectionLoss();
    });

    connection.on("error", (err: Error) => {
      console.error("[RabbitMQ] Connection error", err);
    });

    const channel = await connection.createChannel();
    await channel.prefetch(rabbitConfig.prefetch);

    channel.on("close", () => {
      console.warn("[RabbitMQ] Channel closed");
      this.handleConnectionLoss();
    });

    channel.on("error", (err: Error) => {
      console.error("[RabbitMQ] Channel error", err);
    });

    this.channel = channel;

    return channel;
  }

  private async ensureChannel(): Promise<Channel> {
    if (this.channel) return this.channel;
    if (this.connecting) return this.connecting;

    this.connecting = this.createChannel();
    try {
      return await this.connecting;
    } finally {
      this.connecting = undefined;
    }
  }

  async connect(): Promise<Channel> {
    return this.ensureChannel();
  }

  async assertQueue(
    queue: string,
    options?: Options.AssertQueue,
  ): Promise<void> {
    const channel = await this.ensureChannel();
    await channel.assertQueue(queue, { durable: true, ...options });
  }

  async publish(
    queue: string,
    content: Buffer,
    options?: Options.Publish,
  ): Promise<boolean> {
    const channel = await this.ensureChannel();
    return channel.sendToQueue(queue, content, {
      persistent: true,
      ...options,
    });
  }

  async consume(
    queue: string,
    handler: ConsumeHandler,
    options?: Options.Consume,
  ): Promise<void> {
    const channel = await this.ensureChannel();
    this.rememberConsumer(queue, handler, options);

    await channel.consume(
      queue,
      this.createWrappedHandler(queue, handler),
      { noAck: false, ...options },
    );

    console.info(`[RabbitMQ] Consuming queue "${queue}"`);
  }

  ack(message: ConsumeMessage): void {
    this.channel?.ack(message);
  }

  nack(
    message: ConsumeMessage,
    multiple = false,
    requeue = false,
  ): void {
    this.channel?.nack(message, multiple, requeue);
  }

  async close(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }

    if (this.channel) {
      try {
        await this.channel.close();
      } catch (error) {
        console.error("[RabbitMQ] Failed to close channel", error);
      } finally {
        this.channel = undefined;
      }
    }

    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        console.error("[RabbitMQ] Failed to close connection", error);
      } finally {
        this.connection = undefined;
      }
    }
  }

  private rememberConsumer(
    queue: string,
    handler: ConsumeHandler,
    options?: Options.Consume,
  ): void {
    const index = this.consumers.findIndex(
      (consumer) => consumer.queue === queue && consumer.handler === handler,
    );

    if (index >= 0) {
      this.consumers[index] = { queue, handler, options };
    } else {
      this.consumers.push({ queue, handler, options });
    }
  }

  private createWrappedHandler(
    queue: string,
    handler: ConsumeHandler,
  ): (message: ConsumeMessage | null) => void {
    return (message) => {
      if (!message) return;
      void handler(message).catch((err: unknown) => {
        console.error(
          `[RabbitMQ] Unhandled error while consuming "${queue}"`,
          err,
        );
      });
    };
  }

  private handleConnectionLoss(): void {
    this.channel = undefined;
    this.connection = undefined;

    if (this.reconnectTimeout) return;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = undefined;
      void this.reconnectConsumers();
    }, rabbitConfig.reconnectDelayInMs);
  }

  private async reconnectConsumers(): Promise<void> {
    try {
      const channel = await this.ensureChannel();
      for (const consumer of this.consumers) {
        await channel.consume(
          consumer.queue,
          this.createWrappedHandler(consumer.queue, consumer.handler),
          { noAck: false, ...consumer.options },
        );
        console.info(
          `[RabbitMQ] Re-subscribed to "${consumer.queue}" after reconnect`,
        );
      }
    } catch (err) {
      console.error("[RabbitMQ] Failed to reconnect channel", err);
      this.handleConnectionLoss();
    }
  }
}

export default RabbitMQClient;
