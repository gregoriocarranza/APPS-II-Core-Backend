import { NotFoundError } from "../common/utils/errors";
import { CourseDAO } from "../database/dao/Course/CourseDAO";
import { IDataPaginator } from "../database/interfaces/db.types";
import { ICourse, ExamType } from "../database/interfaces/course/course.interfaces";

export class CoursesService {
  private dao: CourseDAO;

  constructor(dao?: CourseDAO) {
    this.dao = dao ?? new CourseDAO();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    subject_id?: string;
    exam_type?: ExamType;
  }): Promise<IDataPaginator<ICourse>> {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    const filters = {
      subject_id: params?.subject_id,
      exam_type: params?.exam_type,
    };
    return this.dao.getAll(page, limit, filters);
  }

  async getByUuid(uuid: string): Promise<ICourse> {
    const course = await this.dao.getById(uuid);
    if (!course) throw new NotFoundError(`Course ${uuid} no encontrado`);
    return course;
  }

  async create(payload: ICourse): Promise<ICourse> {
    return this.dao.create(payload);
  }

  async update(uuid: string, partial: Partial<ICourse>): Promise<ICourse> {
    const updated = await this.dao.update(uuid, partial);
    if (!updated) throw new NotFoundError(`Course ${uuid} no encontrado`);
    return updated;
  }

  async delete(uuid: string): Promise<{ ok: boolean }> {
    const ok = await this.dao.delete(uuid);
    if (!ok) throw new NotFoundError(`Course ${uuid} no encontrado`);
    return { ok };
  }
}

export default new CoursesService();
