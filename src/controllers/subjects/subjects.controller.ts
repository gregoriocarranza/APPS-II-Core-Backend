// src/controllers/subjects.controller.ts
import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import subjectsService, { SubjectsService } from "../../service/subjects.service";
import { ISubject } from "../../database/interfaces/subject/subject.interfaces";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";

export class SubjectsController implements IBaseController {
  constructor(private service: SubjectsService = subjectsService) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, name } = req.query as {
        page?: string;
        limit?: string;
        name?: string;
      };

      const result = await this.service.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
        name,
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
      const subject = await this.service.getByUuid(uuid);
      res.status(200).json({ success: true, data: subject });
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
      const partial = req.body as Partial<ISubject>;
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

export default new SubjectsController();
