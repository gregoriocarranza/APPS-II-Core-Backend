import type { Knex } from "knex";

/**
 * Creates the 'calendar_events' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - title: título del evento
 *  - description: descripción del evento (opcional)
 *  - type: tipo de evento (ej.: EXAMEN, CLASE, EVENTO, COMEDOR)
 *  - metadata: datos adicionales en formato JSON (por ejemplo: lugar, profesor, link, etc.)
 *  - status: estado de la inscripción (ej.: inscripto, cancelado, en_espera)
 *  - start_at: fecha/hora de inicio
 *  - end_at: fecha/hora de fin
 *  - user_uuid: UUID del usuario inscrito (FK a users.uuid)
 *  - created_at: timestamp con default now()
 *
 * Indexes:
 *  - (start_at, user_uuid): índice para optimizar búsqueda por usuario y fecha
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("calendar_events", (table) => {
    table.string("uuid").primary();
    table.string("title").notNullable();
    table.string("description");
    table.string("type");
    table.jsonb("metadata"); // 👈 JSONB permite insertar objetos nativos sin stringify
    table.string("status").notNullable().defaultTo("inscripto");
    table.timestamp("start_at").notNullable();
    table.timestamp("end_at").notNullable();
    table
      .integer("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("calendar_events");
}
