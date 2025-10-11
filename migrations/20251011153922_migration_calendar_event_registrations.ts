import type { Knex } from "knex";

/**
 * Creates the 'calendar_event_registrations' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - event_uuid: UUID del evento (FK a calendar_events.uuid)
 *  - user_uuid: UUID del usuario inscrito (FK a users.uuid)
 *  - status: estado de la inscripción (ej.: inscripto, cancelado, en_espera)
 *  - created_at: timestamp con default now()
 * 
 * Indexes:
 *  - (event_uuid, user_uuid): índice único para evitar inscripciones duplicadas
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("calendar_event_registrations", (table) => {
    table.uuid("uuid").primary();
    table
      .uuid("event_uuid")
      .notNullable()
      .references("uuid")
      .inTable("calendar_events")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .uuid("user_uuid")
      .notNullable()
      .references("uuid")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("status").notNullable().defaultTo("inscripto");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Índice único compuesto para evitar inscripciones duplicadas
    table.unique(["event_uuid", "user_uuid"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("calendar_event_registrations");
}
