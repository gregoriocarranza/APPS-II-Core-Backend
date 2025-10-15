// src/dao/CourseDAO.ts
import { Knex } from "knex";
import { IBaseDAO, IDataPaginator } from "../../interfaces/db.types";
import KnexManager from "../../KnexConnection";
import { ICourse, ExamType } from "../../interfaces/course/course.interfaces";

export class CourseDAO implements IBaseDAO<ICourse> {
  private _knex: Knex<any, unknown[]> = KnexManager.getConnection();

  async create(item: ICourse): Promise<ICourse> {
    const [created] = await this._knex("courses").insert(item).returning("*");
    return created;
  }

  async getById(uuid: string): Promise<ICourse | null> {
    const result = await this._knex("courses")
      .select("*")
      .where("uuid", uuid)
      .first();
    return result || null;
  }

  async update(uuid: string, item: Partial<ICourse>): Promise<ICourse | null> {
    const [updated] = await this._knex("courses")
      .where({ uuid })
      .update(item)
      .returning("*");
    return updated || null;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this._knex("courses").where({ uuid }).del();
    return result > 0;
  }

  async getAll(
    page: number,
    limit: number,
    filters?: { subject_id?: string; exam_type?: ExamType }
  ): Promise<IDataPaginator<ICourse>> {
    const offset = (page - 1) * limit;

    let query = this._knex("courses").select("*");

    // Apply filters
    if (filters?.subject_id) {
      query = query.where("subject_id", filters.subject_id);
    }
    if (filters?.exam_type) {
      query = query.where("exam_type", filters.exam_type);
    }

    const [countResult] = await query.clone().clearSelect().count("* as count");
    const totalCount = +countResult.count;
    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("id", "desc");

    return {
      success: true,
      data,
      page,
      limit,
      count: data.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
