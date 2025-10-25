import type { Knex } from "knex";

/**
 * Creates the 'materias' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - nombre: nombre de la materia (único y obligatorio)
 *  - uuid_carrera: FK que referencia a 'carreras.uuid'
 *  - description: descripción opcional
 *  - approval_method: método de aprobación (final, promoción, trabajo práctico)
 *  - is_elective: indica si la materia es optativa
 *  - metadata: información extra (profesor, horario, modalidad, etc.)
 * Indexes:
 *  - (uuid_carrera): optimiza búsquedas por carrera
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("materias", (table) => {
    table.uuid("uuid").primary();
    table.string("nombre").notNullable().unique();
    table
      .uuid("uuid_carrera")
      .notNullable()
      .references("uuid")
      .inTable("carreras")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.string("description");
    table.string("approval_method").notNullable();
    table.boolean("is_elective").defaultTo(false);
    table.jsonb("metadata");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["uuid_carrera"], "idx_materias_uuid_carrera");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("materias");
}
