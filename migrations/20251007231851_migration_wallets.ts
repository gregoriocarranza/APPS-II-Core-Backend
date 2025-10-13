import type { Knex } from "knex";

/**
 * Creates the 'wallets' table and links it to 'users'.
 *
 * Columns:
 *  - uuid: UUID (PK)
 *  - user_id: UUID (FK a users.uuid)
 *  - currency: ISO-4217 code ('ARS', 'USD', etc.)
 *  - status: enum('active', 'inactive', 'blocked')
 *  - created_at: timestamp with default now()
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table) => {
    table.string("uuid").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE") // elimina wallets si se borra el user
      .onUpdate("CASCADE");
    table.string("currency", 3).notNullable();
    table
      .enum("status", ["active", "inactive", "blocked"], {
        useNative: true,
        enumName: "wallet_status",
      })
      .notNullable()
      .defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");
  // Si usás Postgres, podés limpiar el enum
  await knex.raw('DROP TYPE IF EXISTS "wallet_status"');
}
