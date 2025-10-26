import { Knex } from "knex";
import KnexManager from "../../KnexConnection";
import { ICorrelativa } from "../../interfaces/materia/correlativa.interface";

export class CorrelativaDAO {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  /**
   * Obtiene todas las correlativas de una materia específica
   * @param uuidMateria - UUID de la materia
   * @returns Array de correlativas
   */
  async getByMateria(uuidMateria: string): Promise<ICorrelativa[]> {
    return this._knex("correlativas")
      .select("*")
      .where("uuid_materia", uuidMateria)
      .orderBy("created_at", "desc");
  }

  /**
   * Obtiene las materias que tienen a esta materia como correlativa
   * (materias que requieren esta materia como prerequisito)
   * @param uuidMateriaCorrelativa - UUID de la materia correlativa
   * @returns Array de correlativas
   */
  async getMateriasQueRequieren(
    uuidMateriaCorrelativa: string,
  ): Promise<ICorrelativa[]> {
    return this._knex("correlativas")
      .select("*")
      .where("uuid_materia_correlativa", uuidMateriaCorrelativa)
      .orderBy("created_at", "desc");
  }

  /**
   * Crea una nueva relación de correlatividad
   * @param correlativa - Datos de la correlativa
   * @returns La correlativa creada
   */
  async create(correlativa: ICorrelativa): Promise<ICorrelativa> {
    const [created] = await this._knex("correlativas")
      .insert(correlativa)
      .returning("*");
    return created;
  }

  /**
   * Elimina una relación de correlatividad
   * @param uuidMateria - UUID de la materia
   * @param uuidMateriaCorrelativa - UUID de la materia correlativa
   * @returns true si se eliminó, false si no existía
   */
  async delete(
    uuidMateria: string,
    uuidMateriaCorrelativa: string,
  ): Promise<boolean> {
    const result = await this._knex("correlativas")
      .where({
        uuid_materia: uuidMateria,
        uuid_materia_correlativa: uuidMateriaCorrelativa,
      })
      .del();
    return result > 0;
  }

  /**
   * Verifica si existe una relación de correlatividad
   * @param uuidMateria - UUID de la materia
   * @param uuidMateriaCorrelativa - UUID de la materia correlativa
   * @returns true si existe, false si no
   */
  async exists(
    uuidMateria: string,
    uuidMateriaCorrelativa: string,
  ): Promise<boolean> {
    const result = await this._knex("correlativas")
      .where({
        uuid_materia: uuidMateria,
        uuid_materia_correlativa: uuidMateriaCorrelativa,
      })
      .first();
    return !!result;
  }

  /**
   * Elimina todas las correlativas de una materia
   * @param uuidMateria - UUID de la materia
   * @returns Cantidad de correlativas eliminadas
   */
  async deleteAllByMateria(uuidMateria: string): Promise<number> {
    return this._knex("correlativas").where({ uuid_materia: uuidMateria }).del();
  }
}
