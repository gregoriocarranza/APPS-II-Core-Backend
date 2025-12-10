import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropUnique(["dni"]);
    table.dropUnique(["email"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.unique(["dni"]);
    table.unique(["email"]);
  });
}
