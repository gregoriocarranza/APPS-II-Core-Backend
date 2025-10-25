import type { Knex } from "knex";

/**
 * Creates the 'carreras' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - name: nombre de la carrera (único y obligatorio)
 *  - description: descripción opcional
 *  - degree_title: título otorgado (ej.: Licenciado en Sistemas)
 *  - code: código interno o abreviatura de la carrera
 *  - faculty: facultad o unidad académica a la que pertenece
 *  - modality: modalidad (presencial, virtual, mixta)
 *  - duration_hours: cantidad total de horas del plan
 *  - duration_years: duración teórica en años
 *  - is_active: indica si la carrera está vigente
 *  - metadata: datos adicionales en JSON
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("carreras", (table) => {
    table.uuid("uuid").primary();
    table.string("name").notNullable().unique();
    table.string("description");
    table.string("degree_title");
    table.string("code");
    table.string("faculty");
    table.string("modality").defaultTo("presencial");
    table.integer("duration_hours").notNullable();
    table.integer("duration_years").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.jsonb("metadata");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("carreras");
}
