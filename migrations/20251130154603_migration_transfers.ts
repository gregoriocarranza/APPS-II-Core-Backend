import type { Knex } from "knex";

/**
 * Creates the 'transfers' table to track wallet movements.
 *
 * Columns:
 *  - uuid: UUID (PK)
 *  - from_wallet_uuid: UUID (FK → wallets.uuid) origen de la transferencia (nullable para depósitos del sistema)
 *  - to_wallet_uuid: UUID (FK → wallets.uuid) destino de la transferencia (nullable para retiros al sistema)
 *  - amount: decimal(18,2), monto de la transferencia (siempre positivo)
 *  - currency: ISO-4217 code ('ARS', 'USD', etc.)
 *  - type: tipo lógico de transferencia ('deposit', 'withdrawal', 'transfer', 'refund', 'adjustment', etc.)
 *  - status: estado de la transferencia ('pending', 'completed', 'failed', 'canceled', etc.)
 *  - description: texto corto describiendo la operación
 *  - metadata: JSON con datos adicionales (origen, IP, etc.)
 *  - processed_at: fecha/hora en la que la transferencia se completó/failed
 *  - created_at: timestamp con default now()
 *  - updated_at: timestamp actualizado automáticamente en cada modificación
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transfers", (table) => {
    table.uuid("uuid").primary();
    table
      .uuid("from_wallet_uuid")
      .nullable()
      .references("uuid")
      .inTable("wallets")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .uuid("to_wallet_uuid")
      .nullable()
      .references("uuid")
      .inTable("wallets")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table.decimal("amount", 18, 2).notNullable();
    table.string("currency", 3).notNullable();
    table.string("type", 50).notNullable();
    table.string("status", 50).notNullable().defaultTo("pending");
    table.string("description", 255).nullable();
    table.json("metadata").nullable();
    table.timestamp("processed_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["from_wallet_uuid"], "idx_transfers_from_wallet");
    table.index(["to_wallet_uuid"], "idx_transfers_to_wallet");
    table.index(["status"], "idx_transfers_status");
    table.index(["created_at"], "idx_transfers_created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transfers");
}
