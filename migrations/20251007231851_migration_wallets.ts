import type { Knex } from "knex";

/**
 * Creates the 'wallets' table and links it to 'users'.
 *
 * Columns:
 *  - uuid: UUID (PK)
 *  - user_uuid: UUID (FK → users.uuid)
 *  - currency: ISO-4217 code ('ARS', 'USD', etc.)
 *  - balance: decimal(18,2), saldo actual de la billetera
 *  - status: enum('active', 'inactive', 'blocked')
 *  - last_activity_at: fecha/hora de la última transacción o actividad
 *  - created_at: timestamp con default now()
 *  - updated_at: timestamp actualizado automáticamente en cada modificación
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table) => {
    table.uuid("uuid").primary();
    table
      .uuid("user_uuid")
      .notNullable()
      .references("uuid")
      .inTable("users")
      .onDelete("CASCADE") // elimina wallets si se borra el user
      .onUpdate("CASCADE");
    table.string("currency", 3).notNullable();
    table.decimal("balance", 18, 2).notNullable().defaultTo(0.0);
    table.string("status").notNullable().defaultTo("active");
    table.timestamp("last_activity_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");
}
