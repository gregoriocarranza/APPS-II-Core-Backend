import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { InscripcionesService } from "../../service/inscripciones.service";
import { ToIInscripcionesDTO } from "../../common/dto/inscripciones/inscriopciones.interface.dto";
import { v4 as uuidv4 } from "uuid";
import { ExtendedRequest } from "../../interfaces/auth.interface";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../common/utils/errors";
import { EmailerService } from "../../service/mailer.service";
import { CursosService } from "../../service/cursos.service";
import { UserService } from "../../service/user.service";
import { bodyTypes } from "../../common/dto/notificaciones/notificaciones.dto";
import { NotificationsService } from "../../service/notifications.service";
import { enumTemplateKey } from "../../common/templates";
import { InscripcionEstadoEnum } from "../../database/interfaces/inscripciones/inscripciones.interfaces";
import { RolInicialEnum } from "../../common/dto/curso/CursoInscripcionInicialDTO";
export class InscripcionesController implements IBaseController {
  inscripcionesService: InscripcionesService;
  emailerService: EmailerService;
  cursosService: CursosService;
  userService: UserService;
  notificationsService: NotificationsService;

  rolesSensibles: string[];
  rolesPermitidos: string[];
  constructor() {
    this.inscripcionesService = new InscripcionesService();
    this.cursosService = new CursosService();
    this.userService = new UserService();
    this.notificationsService = new NotificationsService();
    this.emailerService = EmailerService.instance;
    this.rolesSensibles = ["TITULAR", "AUXILIAR"];
    this.rolesPermitidos = ["ADMINISTRADOR", "DOCENTE"];
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, uuid_curso, user_uuid, estado } = req.query;
      const result = await this.inscripcionesService.getAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        uuid_curso: uuid_curso as string | undefined,
        user_uuid: user_uuid as string | undefined,
        estado: estado as InscripcionEstadoEnum | undefined,
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
      const ExtReq = req as ExtendedRequest;
      const dto: ToIInscripcionesDTO = await ToIInscripcionesDTO.build({
        ...req.body,
        uuid: uuidv4(),
      });

      if (
        this.rolesSensibles.includes(dto.rol) &&
        !this.rolesPermitidos.includes(ExtReq.user.rol)
      ) {
        console.warn(
          `⚠️  Intento de modificación NO autorizado:
          • Rol del curso: ${dto.rol}
          • Usuario que intenta modificar: ${ExtReq.user.rol}
          • Usuario UUID: ${ExtReq.user.uuid ?? "N/A"}
          • Acción: modificación de curso sensible`
        );

        throw new UnauthorizedError(
          `No tiene permisos para modificar cursos con rol ${dto.rol}.`
        );
      }

      const curso = await this.cursosService.getByUuid(dto.uuid_curso);

      if (
        curso.inscripciones_totales + 1 > curso.cantidad_max &&
        dto.rol !== RolInicialEnum.TITULAR &&
        dto.rol !== RolInicialEnum.AUXILIAR
      ) {
        throw new ConflictError(
          `El curso "${curso.materia.nombre}" ya alcanzó el cupo máximo (${curso.cantidad_max})`
        );
      }

      const result = await this.inscripcionesService.create(dto);

      const user = await this.userService.getByUuid(result.user_uuid);

      const templateFunction = await this.notificationsService.getTemplateById(
        enumTemplateKey.INSCRIPCIONES
      );

      const { body, title } = templateFunction({
        inscripcion: result,
        curso,
        user,
      });

      await this.emailerService.sendMail({
        to: user.email,
        subject: title,
        bodyType: bodyTypes.html,
        body: body,
      });
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
      const ExtReq = req as ExtendedRequest;
      const { uuid } = req.params;

      if (!uuid) {
        throw new BadRequestError("Falta el parámetro uuid de la inscripción.");
      }
      const inscripcion = await this.inscripcionesService.getByUuid(uuid);
      if (
        inscripcion.user.uuid != ExtReq.user.uuid &&
        ExtReq.user.rol != "ADMINISTRADOR"
      ) {
        throw new UnauthorizedError(
          "No tienes permiso para realizar esta operacion."
        );
      }

      if (inscripcion.estado == InscripcionEstadoEnum.BAJA) {
        throw new BadRequestError("La inscripcion se encuentra dada de baja");
      }
      const { razon } = req.body;

      if (!razon) {
        throw new BadRequestError("Falta el motivo (razón) de la baja.");
      }
      const result = await this.inscripcionesService.darBaja(uuid, razon);
      const curso = await this.cursosService.getByUuid(result.uuid_curso);
      const user = await this.userService.getByUuid(result.user_uuid);

      const templateFunction = await this.notificationsService.getTemplateById(
        enumTemplateKey.INSCRIPCIONES_BAJA
      );

      const { body, title } = templateFunction({
        inscripcion: result,
        curso,
        user,
      });

      await this.emailerService.sendMail({
        to: user.email,
        subject: title,
        bodyType: bodyTypes.html,
        body: body,
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }
}
