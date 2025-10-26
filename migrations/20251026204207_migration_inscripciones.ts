import type { Knex } from "knex";

/**
 * Creates the 'inscripciones' table.
 *
 * Columns:
 *  - uuid: UUID (PK)
 *  - uuid_curso: FK que referencia a 'cursos.uuid'
 *  - uuid_alumno: FK que referencia a 'usuarios.uuid'
 *  - estado: estado de la inscripción ('pendiente', 'confirmada', 'baja')
 *  - rol: rol de la persona dentro del curso ('ALUMNO', 'TITULAR', 'AUXILIAR')
 *  - razon: motivo de baja o cancelación (vacío si no aplica)
 *  - fecha_baja: fecha en la que el alumno se dio de baja (nullable)
 *  - created_at: fecha de creación del registro
 *  - updated_at: fecha de última actualización
 *
 * Constraints:
 *  - UNIQUE (uuid_curso, uuid_alumno): evita inscripciones duplicadas del mismo alumno en un curso
 *
 * Indexes:
 *  - (uuid_curso): optimiza búsquedas por curso
 *  - (uuid_alumno): optimiza búsquedas por alumno
 */

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("inscripciones", (table) => {
    table.uuid("uuid").primary();
    table
      .uuid("uuid_curso")
      .notNullable()
      .references("uuid")
      .inTable("cursos")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .uuid("uuid_alumno")
      .notNullable()
      .references("uuid")
      .inTable("usuarios")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("estado").notNullable().defaultTo("pendiente");
    table.string("rol").notNullable().defaultTo("ALUMNO");
    table.string("razon").notNullable().defaultTo("");
    table.timestamp("fecha_baja").defaultTo(knex.fn.now());

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.unique(["uuid_curso", "uuid_alumno"], {
      indexName: "uq_inscripciones_curso_alumno",
    });
    table.index(["uuid_curso"], "idx_inscripciones_uuid_curso");
    table.index(["uuid_alumno"], "idx_inscripciones_uuid_alumno");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("inscripciones");
}
