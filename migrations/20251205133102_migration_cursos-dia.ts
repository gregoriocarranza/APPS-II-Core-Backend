import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cursos", (table) => {
    table
      .string("dia")
      .notNullable()
      .defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cursos", (table) => {
    table.dropColumn("dia");
  });
}
