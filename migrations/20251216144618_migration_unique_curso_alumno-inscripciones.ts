import type { Knex } from "knex";

/**
 * Drops UNIQUE constraint on (uuid_curso, user_uuid) from inscripciones
 */

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("inscripciones", (table) => {
    table.dropUnique(
      ["uuid_curso", "user_uuid"],
      "uq_inscripciones_curso_alumno"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("inscripciones", (table) => {
    table.unique(["uuid_curso", "user_uuid"], {
      indexName: "uq_inscripciones_curso_alumno",
    });
  });
}
