import { NotFoundError } from "../common/utils/errors";
import { CorrelativaDAO } from "../database/dao/materia/correlativaDAO";
import { MateriasDAO } from "../database/dao/materia/materiaDAO";
import { ICorrelativa } from "../database/interfaces/materia/correlativa.interface";

export class CorrelativasService {
  private correlativaDAO: CorrelativaDAO;
  private materiasDAO: MateriasDAO;

  constructor(correlativaDAO?: CorrelativaDAO, materiasDAO?: MateriasDAO) {
    this.correlativaDAO = correlativaDAO ?? new CorrelativaDAO();
    this.materiasDAO = materiasDAO ?? new MateriasDAO();
  }

  /**
   * Obtiene todas las correlativas de una materia
   * @param uuidMateria - UUID de la materia
   * @returns Array de correlativas con datos completos de las materias
   */
  async getByMateria(uuidMateria: string): Promise<ICorrelativa[]> {
    // Verificar que la materia existe
    const materia = await this.materiasDAO.getByUuid(uuidMateria);
    if (!materia) {
      throw new NotFoundError(`Materia ${uuidMateria} no encontrada`);
    }

    return this.correlativaDAO.getByMateria(uuidMateria);
  }

  /**
   * Agrega una correlativa a una materia
   * @param uuidMateria - UUID de la materia que tendrá el requisito
   * @param uuidMateriaCorrelativa - UUID de la materia que es requisito
   * @returns La correlativa creada
   */
  async addCorrelativa(
    uuidMateria: string,
    uuidMateriaCorrelativa: string,
  ): Promise<ICorrelativa> {
    // Validar que ambas materias existen
    const [materia, materiaCorrelativa] = await Promise.all([
      this.materiasDAO.getByUuid(uuidMateria),
      this.materiasDAO.getByUuid(uuidMateriaCorrelativa),
    ]);

    if (!materia) {
      throw new NotFoundError(`Materia ${uuidMateria} no encontrada`);
    }

    if (!materiaCorrelativa) {
      throw new NotFoundError(
        `Materia correlativa ${uuidMateriaCorrelativa} no encontrada`,
      );
    }

    // Validar que no es la misma materia
    if (uuidMateria === uuidMateriaCorrelativa) {
      throw new Error("Una materia no puede ser correlativa de sí misma");
    }

    // Validar que no existe ya la relación
    const exists = await this.correlativaDAO.exists(
      uuidMateria,
      uuidMateriaCorrelativa,
    );
    if (exists) {
      throw new Error("La correlativa ya existe");
    }

    // Validar que no se crea una dependencia circular
    const wouldCreateCircular = await this.checkCircularDependency(
      uuidMateria,
      uuidMateriaCorrelativa,
    );
    if (wouldCreateCircular) {
      throw new Error(
        "No se puede crear la correlativa: generaría una dependencia circular",
      );
    }

    const correlativa: ICorrelativa = {
      uuid_materia: uuidMateria,
      uuid_materia_correlativa: uuidMateriaCorrelativa,
      created_at: new Date(),
    };

    return this.correlativaDAO.create(correlativa);
  }

  /**
   * Elimina una correlativa de una materia
   * @param uuidMateria - UUID de la materia
   * @param uuidMateriaCorrelativa - UUID de la materia correlativa
   * @returns Objeto indicando éxito
   */
  async removeCorrelativa(
    uuidMateria: string,
    uuidMateriaCorrelativa: string,
  ): Promise<{ ok: boolean }> {
    const deleted = await this.correlativaDAO.delete(
      uuidMateria,
      uuidMateriaCorrelativa,
    );
    if (!deleted) {
      throw new NotFoundError("Correlativa no encontrada");
    }
    return { ok: true };
  }

  /**
   * Verifica si agregar una correlativa crearía una dependencia circular
   * @param uuidMateria - UUID de la materia que tendría el requisito
   * @param uuidMateriaCorrelativa - UUID de la materia que sería requisito
   * @returns true si crearía un ciclo, false si no
   */
  private async checkCircularDependency(
    uuidMateria: string,
    uuidMateriaCorrelativa: string,
  ): Promise<boolean> {
    // Si la materia correlativa tiene como requisito (directo o transitivo) a uuidMateria,
    // entonces agregar esta correlativa crearía un ciclo

    const visited = new Set<string>();
    const queue: string[] = [uuidMateriaCorrelativa];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (visited.has(current)) continue;
      visited.add(current);

      // Si encontramos la materia original, hay un ciclo
      if (current === uuidMateria) {
        return true;
      }

      // Obtener todas las correlativas de la materia actual
      const correlativas = await this.correlativaDAO.getByMateria(current);

      // Agregar todas las correlativas a la cola para seguir buscando
      for (const corr of correlativas) {
        if (!visited.has(corr.uuid_materia_correlativa)) {
          queue.push(corr.uuid_materia_correlativa);
        }
      }
    }

    return false;
  }
}

export default new CorrelativasService();
