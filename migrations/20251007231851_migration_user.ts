import type { Knex } from "knex";

/**
 * Creates the 'users' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - bo_id: number (opcional: ID interno o referencia externa)
 *  - name: string
 *  - email: unique string
 *  - created_at: timestamp with default now()
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("uuid").primary();
    table.integer("bo_id").unsigned().nullable();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
