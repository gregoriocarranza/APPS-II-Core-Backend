import type { Knex } from "knex";

/**
 * Creates the 'cursos' table.
 *
 * Columns:
 *  - uuid: UUID (PK)
 *  - uuid_materia: FK que referencia a 'materias.uuid'
 *  - examen: tipo o descripción del examen final (opcional)
 *  - comision: identificador de la comisión (ej.: "A", "B", "C")
 *  - modalidad: modalidad de cursada ('PRESENCIAL', 'VIRTUAL', 'HÍBRIDA')
 *  - sede: sede donde se dicta el curso
 *  - aula: aula asignada
 *  - periodo: período o cuatrimestre académico
 *  - turno: turno de cursada ('Mañana', 'Tarde', 'Noche')
 *  - estado: estado del curso ('activo', 'cerrado', 'cancelado')
 *  - cantidad_max: cantidad máxima de inscriptos (default: 35)
 *  - cantidad_min: cantidad mínima para abrir el curso (default: 10)
 *  - desde: fecha de inicio de la cursada
 *  - hasta: fecha de finalización de la cursada
 *  - created_at / updated_at / deleted_at: auditoría
 *
 * Indexes:
 *  - (uuid_materia): optimiza búsquedas por materia
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("cursos", (table) => {
    table.uuid("uuid").primary();
    table
      .uuid("uuid_materia")
      .notNullable()
      .references("uuid")
      .inTable("materias")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("examen");
    table.string("comision");
    table.string("modalidad");
    table.string("sede");
    table.string("aula");
    table.string("periodo");
    table.string("turno").comment("Mañana, Tarde o Noche");
    table.string("estado").notNullable().defaultTo("activo");

    table.integer("cantidad_max").notNullable().defaultTo(35);
    table.integer("cantidad_min").notNullable().defaultTo(10);

    table.timestamp("desde").notNullable();
    table.timestamp("hasta").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["uuid_materia"], "idx_cursos_uuid_materia");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("cursos");
}
