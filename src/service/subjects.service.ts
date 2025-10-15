import { NotFoundError } from "../common/utils/errors";
import { SubjectDAO } from "../database/dao/Subject/SubjectDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { ISubject } from "../database/interfaces/subject/subject.interfaces";

export class SubjectsService {
  private dao: SubjectDAO;

  constructor(dao?: SubjectDAO) {
    this.dao = dao ?? new SubjectDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    name?: string;
  }): Promise<IDataPaginator<ISubject>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    const filters = {
      name: params?.name,
    };
    return this.dao.getAll(page, limit, filters);
  }

  async getByUuid(uuid: string): Promise<ISubject> {
    const subject = await this.dao.getById(uuid);
    if (!subject) throw new NotFoundError(`Subject ${uuid} no encontrado`);
    return subject;
  }

  async create(payload: ISubject): Promise<ISubject> {
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<ISubject>): Promise<ISubject> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Subject ${uuid} no encontrado`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Subject ${uuid} no encontrado`);
    return { ok };
  }
}

export default new SubjectsService();
