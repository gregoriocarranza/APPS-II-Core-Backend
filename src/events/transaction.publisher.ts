import { EXCHANGES } from "../common/config/rabbitMq/config";
import { ITransfer } from "../database/interfaces/transfer/transfer.interface";
import { buildDomainEvent, publishDomainEvent } from "../rabbitMq/Publisher";

export async function emitTransactionCreated(
  carrera: ITransfer
): Promise<void> {
  const event = buildDomainEvent("transaction.created", carrera);
  await publishDomainEvent(EXCHANGES.TRANSACTION, "transaction.created", event);
}

export async function emitTransactionDeleted(uuid: string): Promise<void> {
  const event = buildDomainEvent("transaction.deleted", { uuid });
  await publishDomainEvent(EXCHANGES.TRANSACTION, "transaction.deleted", event);
}
