import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { CursosService } from "../../service/cursos.service";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { CursoInscripcionInicialDTO } from "../../common/dto/curso/CursoInscripcionInicialDTO";
import { InscripcionesService } from "../../service/inscripciones.service";
import { CursoCreateDTO } from "../../common/dto/curso/create.curso.dto";
import { v4 as uuidv4 } from "uuid";
import { ToIInscripcionesDTO } from "../../common/dto/inscripciones/inscriopciones.interface.dto";

export class CursosController implements IBaseController {
  cursosService: CursosService;
  inscripcionesService: InscripcionesService;

  constructor() {
    this.cursosService = new CursosService();
    this.inscripcionesService = new InscripcionesService();
  }
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit } = req.query as {
        page?: string;
        limit?: string;
      };

      const result = await this.cursosService.getAll({
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
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
      const data = await this.cursosService.getByUuid(uuid);
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
      if (
        !req.body.inscripciones_iniciales ||
        req.body.inscripciones_iniciales.length === 0
      ) {
        throw new BadRequestError(
          "Debe incluir al menos un docente o auxiliar en 'inscripciones_iniciales'."
        );
      }
      const dto: CursoCreateDTO = await CursoCreateDTO.build({
        ...req.body,
        uuid: uuidv4(),
      });
      const created = await this.cursosService.create(dto);

      const inscripcionesIniciales = CursoInscripcionInicialDTO.build(
        req.body.inscripciones_iniciales
      );
      for (const inscripcion of inscripcionesIniciales) {
        const inscripcionDto: ToIInscripcionesDTO =
          await ToIInscripcionesDTO.build({
            uuid_curso: created.uuid,
            user_uuid: inscripcion.user_uuid,
            estado: inscripcion.estado,
            rol: inscripcion.rol,
            uuid: uuidv4(),
          });
        const result = await this.inscripcionesService.create(inscripcionDto);
        console.log(result);
      }

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
      await this.cursosService.delete(uuid);
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
