import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("notificaciones", (table) => {
    table.string("status").defaultTo("NEW"); //"new"  | "opened"  | "hidden"  | "deleted";
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("notificaciones", (table) => {
    table.dropColumn("status");
  });
}
