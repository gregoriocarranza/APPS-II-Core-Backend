import type { Knex } from "knex";

/**
 * Creates the 'users' table.
 * Represents all registered people in the system (students, teachers, staff, guests, etc.).
 * Includes personal, academic, and contact information.
 *
 * Columns:
 *  - uuid: UUID (PK)
 *  - nombre: string
 *  - apellido: string
 *  - legajo: unique string (academic or employee identifier)
 *  - dni: unique integer (national ID)
 *  - correo_institucional: unique string
 *  - correo_personal: string (optional)
 *  - telefono_personal: string (optional)
 *  - fecha_alta: timestamp with default now()
 *  - status: enum ('activo', 'inactivo', 'suspendido')
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("uuid").primary();
    table.string("nombre").notNullable();
    table.string("apellido").notNullable();
    table.string("legajo").unique().notNullable();
    table.integer("dni").unique().notNullable();
    table.string("email").unique().notNullable();
    table.string("telefono_personal").unique().notNullable();
    table.string("status").defaultTo("activo");
    table.string("rol").notNullable();
    table
      .uuid("carrera_uuid")
      .references("uuid")
      .inTable("carreras")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table.timestamp("fecha_alta").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
