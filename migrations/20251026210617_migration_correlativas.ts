import type { Knex } from "knex";

/**
 * Creates the 'correlativas' table.
 * Defines prerequisite relationships between subjects (materias).
 * A subject "A" is a prerequisite (correlativa) of subject "B" if
 * passing "A" is required before taking "B".
 *
 * Columns:
 *  - uuid_materia: UUID of the subject that requires the prerequisite (FK to materias.uuid)
 *  - uuid_materia_correlativa: UUID of the prerequisite subject (FK to materias.uuid)
 *  - created_at: timestamp of when the prerequisite was established
 *
 * Primary Key: Composite key (uuid_materia, uuid_materia_correlativa)
 *
 * Indexes:
 *  - (uuid_materia_correlativa): optimizes reverse queries
 *    (e.g., "which subjects have X as a prerequisite?")
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("correlativas", (table) => {
    table
      .uuid("uuid_materia")
      .notNullable()
      .references("uuid")
      .inTable("materias")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .uuid("uuid_materia_correlativa")
      .notNullable()
      .references("uuid")
      .inTable("materias")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Composite primary key
    table.primary(["uuid_materia", "uuid_materia_correlativa"]);

    // Index for reverse queries
    table.index(
      ["uuid_materia_correlativa"],
      "idx_correlativas_materia_correlativa",
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("correlativas");
}
