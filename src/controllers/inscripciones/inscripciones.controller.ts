import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { InscripcionesService } from "../../service/inscripciones.service";
import { ToIInscripcionesDTO } from "../../common/dto/inscripciones/inscriopciones.interface.dto";
import { v4 as uuidv4 } from "uuid";
export class InscripcionesController implements IBaseController {
  inscripcionesService: InscripcionesService;
  constructor() {
    this.inscripcionesService = new InscripcionesService();
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, uuid_curso, user_uuid } = req.query;
      const result = await this.inscripcionesService.getAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        uuid_curso: uuid_curso as string | undefined,
        user_uuid: user_uuid as string | undefined,
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
      const result = await this.inscripcionesService.getByUuid(uuid);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: ToIInscripcionesDTO = await ToIInscripcionesDTO.build({
        ...req.body,
        uuid: uuidv4(),
      });
      const result = await this.inscripcionesService.create(dto);
      res.status(201).json(result);
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
      const dto: ToIInscripcionesDTO = await ToIInscripcionesDTO.build(
        req.body
      );
      const result = await this.inscripcionesService.update(uuid, dto);
      res.status(200).json(result);
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
      const result = await this.inscripcionesService.delete(uuid);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  // ---------- Helpers de estado ----------

  public async confirmar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const result = await this.inscripcionesService.confirmar(uuid);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  public async darBaja(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const { razon } = req.body;
      const result = await this.inscripcionesService.darBaja(uuid, razon);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }
}
