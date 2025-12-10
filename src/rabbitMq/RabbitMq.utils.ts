import amqplib, { type ConfirmChannel } from "amqplib";
import {
  ALL_EXCHANGES,
  QUEUE_NAME,
  rabbitUrl,
} from "../common/config/rabbitMq/config";

let channel: ConfirmChannel | null = null;
let initializingChannel: Promise<ConfirmChannel> | null = null;
const ensuredExchanges = new Set<string>();
const ensuringExchanges = new Map<string, Promise<void>>();

function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === 404
  );
}

export async function ensureExchangeOnChannel(
  ch: ConfirmChannel,
  name: string
): Promise<void> {
  if (ensuredExchanges.has(name)) return;

  const inflight = ensuringExchanges.get(name);
  if (inflight) return inflight;

  const promise = (async (): Promise<void> => {
    try {
      await ch.checkExchange(name);
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error(
          `[RabbitMQ] Exchange "${name}" no existe o no tenés acceso. Revisar configuración de Rabbit.`
        );
      }
      throw err;
    }
  })()
    .then(() => {
      ensuredExchanges.add(name);
      ensuringExchanges.delete(name);
    })
    .catch((err) => {
      ensuringExchanges.delete(name);
      throw err;
    });

  ensuringExchanges.set(name, promise);
  return promise;
}

export async function ensureQueue(name: string): Promise<void> {
  const ch = await getChannel();

  try {
    const res = await ch.checkQueue(name);
    console.log(
      `[RabbitMQ] Queue ${res.queue} existe y tiene ${res.messageCount} evento.`
    );
  } catch (err: any) {
    const msg = err?.message?.toLowerCase?.() ?? "";
    const code = err?.code;

    const isMissing =
      code === 404 || msg.includes("no queue") || msg.includes("not found");

    if (isMissing) {
      throw new Error(
        `[RabbitMQ] Queue "${name}" no existe o no tenés permisos para accederla. Revisar configuración.`
      );
    }

    throw err;
  }
}

function resetExchangeCache(): void {
  ensuredExchanges.clear();
  ensuringExchanges.clear();
}

export async function createChannel(): Promise<ConfirmChannel> {
  const conn = await amqplib.connect(rabbitUrl);

  const handleClose = (): void => {
    console.warn("[RabbitMQ] Connection closed. Will reconnect on demand.");
    channel = null;
    initializingChannel = null;
    resetExchangeCache();
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
    resetExchangeCache();
  });

  console.info("[RabbitMQ] Channel ready");

  return ch;
}

export async function getChannel(): Promise<ConfirmChannel> {
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

export async function ensureExchange(name: string): Promise<void> {
  const ch = await getChannel();
  await ensureExchangeOnChannel(ch, name);
}

export async function initRabbit(): Promise<void> {
  await Promise.all(ALL_EXCHANGES.map((name) => ensureExchange(name)));
  await ensureQueue(QUEUE_NAME);
}
