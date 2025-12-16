import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { NotificationsService } from "../../service/notifications.service";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";
import { INotificacion } from "../../database/interfaces/notification/notification.interfaces";
import { EmailerService } from "../../service/mailer.service";
import { UserService } from "../../service/user.service";
import { IUser } from "../../database/interfaces/user/user.interfaces";
import {
  INotificacionDTO,
  notificationStatusEnum,
} from "../../common/dto/notificaciones/Inotificaciones.dto";
import { NotificationCreatedByTypeDTO } from "../../common/dto/notificaciones/create.notificaciones.dto";
import {
  bodyTypes,
  NotificationCreatedDTO,
} from "../../common/dto/notificaciones/notificaciones.dto";
// import { inputValidator } from "../../common/helpers/validate.dto";
export class NotificationsController implements IBaseController {
  notificationService: NotificationsService;
  emailerService: EmailerService;
  userService: UserService;
  constructor() {
    this.notificationService = new NotificationsService();
    this.userService = new UserService();
    this.emailerService = EmailerService.instance;
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, user_uuid } = req.query as {
        page?: string;
        limit?: string;
        user_uuid?: string;
      };

      if (user_uuid) {
        const data = await this.notificationService.getByuserUuid({
          user_uuid,
          page: page ? +page : 1,
          limit: limit ? +limit : 20,
        });
        res.status(200).json(data);
        return;
      }

      const result = await this.notificationService.getAll({
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
      const notifications = await this.notificationService.getByUuid(uuid);
      res.status(200).json({ success: true, data: notifications });
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
  ): Promise<any> {
    try {
      const notificationDto: NotificationCreatedByTypeDTO = req.body;

      const user: IUser | undefined = await this.userService.getByUuid(
        notificationDto.user_uuid
      );
      if (!user)
        throw new NotFoundError(
          `User ${notificationDto.user_uuid} no encontrado`
        );

      const templateFunction = await this.notificationService.getTemplateById(
        notificationDto.EmailType
      );

      const { body, title } = await templateFunction(req.body);

      const payload: INotificacionDTO = INotificacionDTO.build({
        ...req.body,
        uuid: uuidv4(),
        body,
        title,
      });

      const created = await this.notificationService.create(payload);

      const response: NotificationCreatedDTO =
        NotificationCreatedDTO.build(created);

      const info = await this.emailerService.sendMail({
        to: user.email,
        subject: title,
        bodyType: bodyTypes.html,
        body: body,
        attachments: undefined,
      });
      res.status(201).json({ success: true, data: response, info });
    } catch (err: any) {
      next(err);
    }
  }

  public async changeStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        throw new BadRequestError("Es nesesario un Uuid en el parametro");
      }

      const { status } = req.body;
      if (
        !Object.values(notificationStatusEnum).includes(status.toUpperCase())
      ) {
        throw new BadRequestError(
          `Estado de notificación inválido. Valores permitidos: ${Object.values(
            notificationStatusEnum
          ).join(", ")}`
        );
      }

      const notifications: INotificacion =
        await this.notificationService.getByUuid(uuid);

      const notificationDTO: INotificacionDTO = await INotificacionDTO.build({
        ...notifications,
        status,
      });

      const updated: INotificacion = await this.notificationService.update(
        uuid,
        notificationDTO
      );

      const notificationResponse: NotificationCreatedDTO =
        await NotificationCreatedDTO.build(updated);

      res.status(200).json({ success: true, data: notificationResponse });
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
      res.send("Function not implemented");
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
      await this.notificationService.delete(uuid);
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
