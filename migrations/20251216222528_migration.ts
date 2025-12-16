import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("notificaciones", (table) => {
    table.jsonb("metadata");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("notificaciones", (table) => {
    table.dropColumn("metadata");
  });
}
