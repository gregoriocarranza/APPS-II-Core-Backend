import { IWallet } from "../database/interfaces/wallet/wallet.interfaces";
import { buildDomainEvent, publishDomainEvent } from "../lib/rabbitmq";

const EVENT_VERSION = 1;
const WALLETS_EXCHANGE =
  process.env.WALLETS_EXCHANGE?.trim() || "wallets.event";

export async function emitWalletCreated(wallet: IWallet): Promise<void> {
  const event = buildDomainEvent("wallet.created", wallet, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(WALLETS_EXCHANGE, "wallet.created", event);
}

export async function emitWalletUpdated(wallet: IWallet): Promise<void> {
  const event = buildDomainEvent("wallet.updated", wallet, {
    version: EVENT_VERSION,
  });
  await publishDomainEvent(WALLETS_EXCHANGE, "wallet.updated", event);
}

export async function emitWalletDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent(
    "wallet.deleted",
    { uuid },
    { version: EVENT_VERSION },
  );
  await publishDomainEvent(WALLETS_EXCHANGE, "wallet.deleted", event);
}
