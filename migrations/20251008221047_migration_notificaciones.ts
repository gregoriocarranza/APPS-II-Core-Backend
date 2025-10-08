import type { Knex } from "knex";

/**
 * Creates the 'notificaciones' table.
 * Columns:
 *  - uuid: UUID (PK)
 *  - id_user: integer (FK o referencia al usuario que recibe la notificación)
 *  - title: título de la notificación
 *  - body: cuerpo o descripción del mensaje
 *  - from: origen o emisor de la notificación (p.ej., sistema, usuario)
 *  - created_at: timestamp con valor por defecto en NOW()
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("notificaciones", (table) => {
    table.uuid("uuid").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("title").notNullable();
    table.text("body").notNullable();
    table.string("from").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("notificaciones");
}
