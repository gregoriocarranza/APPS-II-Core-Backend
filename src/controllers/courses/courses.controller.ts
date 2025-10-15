// src/controllers/courses.controller.ts
import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import coursesService, { CoursesService } from "../../service/courses.service";
import { ICourse, ExamType } from "../../database/interfaces/course/course.interfaces";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";

export class CoursesController implements IBaseController {
  constructor(private service: CoursesService = coursesService) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, subject_id, exam_type } = req.query as {
        page?: string;
        limit?: string;
        subject_id?: string;
        exam_type?: ExamType;
      };

      const result = await this.service.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
        subject_id,
        exam_type,
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  public async getByUuid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const course = await this.service.getByUuid(uuid);
      res.status(200).json({ success: true, data: course });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = { ...req.body, uuid: uuidv4() };
      const created = await this.service.create(payload);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const partial = req.body as Partial<ICourse>;
      const updated = await this.service.update(uuid, partial);
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      await this.service.delete(uuid);
      res.status(204).end();
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }
}

export default new CoursesController();
