import type { Knex } from "knex";

/**
 * Creates the 'calendar_events' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - title: título del evento
 *  - description: descripción del evento (opcional)
 *  - type: tipo de evento (ej.: EXAMEN, CLASE, EVENTO, COMEDOR)
 *  - location: sede/aula u otro lugar
 *  - capacity: cupo máximo
 *  - start_at: fecha/hora de inicio
 *  - end_at: fecha/hora de fin
 *  - created_by: UUID del usuario creador (FK a users.uuid)
 *  - created_at: timestamp con default now()
 * 
 * Indexes:
 *  - (location, start_at): índice único para evitar doble reserva exacta
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("calendar_events", (table) => {
    table.uuid("uuid").primary();
    table.string("title").notNullable();
    table.string("description");
    table.string("type");
    table.string("location");
    table.integer("capacity");
    table.timestamp("start_at").notNullable();
    table.timestamp("end_at").notNullable();
    table
      .uuid("created_by")
      .notNullable()
      .references("uuid")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Índice único compuesto para evitar doble reserva exacta
    table.unique(["location", "start_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("calendar_events");
}
