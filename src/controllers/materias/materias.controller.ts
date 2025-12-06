import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { MateriasService } from "../../service/materias.service";
import { CorrelativasService } from "../../service/correlativas.service";
import { NotFoundError } from "../../common/utils/errors";

export class MateriasController implements IBaseController {
  materiasService: MateriasService;
  correlativasService: CorrelativasService;
  constructor() {
    this.materiasService = new MateriasService();
    this.correlativasService = new CorrelativasService();
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, uuid_carrera, name_materia } = req.query;

      const result = await this.materiasService.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
        uuid_carrera: uuid_carrera as string | undefined,
        name_materia: name_materia as string | undefined,
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
      const data = await this.materiasService.getByUuid(uuid);
      res.status(200).json({ success: true, data: data });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
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
      console.log(uuid);
      res.send("Ok");
    } catch (err: any) {
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const created = await this.materiasService.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
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
      await this.materiasService.delete(uuid);
      res.status(204).end();
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  // ========== CORRELATIVAS ==========

  public async getCorrelativas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const data = await this.correlativasService.getByUuidMateria(uuid);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async addCorrelativa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const { uuid_materia_correlativa } = req.body;
      const data = await this.correlativasService.addCorrelativa(
        uuid,
        uuid_materia_correlativa
      );
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, message: err.message });
        return;
      }
      if (err.message.includes("circular") || err.message.includes("misma")) {
        res.status(400).json({ success: false, message: err.message });
        return;
      }
      if (err.message.includes("ya existe")) {
        res.status(409).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  public async removeCorrelativa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid, uuidCorrelativa } = req.params;
      await this.correlativasService.removeCorrelativa(uuid, uuidCorrelativa);
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
