import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import { NotificationsService } from "../../service/notifications.service";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";
import { INotificacion } from "../../database/interfaces/notification/notification.interfaces";
import { EmailerService } from "../../service/mailer.service";
import { UserService } from "../../service/user.service";
import { IUser } from "../../database/interfaces/user/user.interfaces";
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
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit, user_id } = req.query as {
        page?: string;
        limit?: string;
        user_id?: number;
      };

      if (user_id) {
        const data = await this.notificationService.getByUserId({
          user_id,
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
    next: NextFunction,
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
    next: NextFunction,
  ): Promise<any> {
    try {
      const notificationDto = req.body;

      const user: IUser | undefined = await this.userService.getByUuid(
        notificationDto.uuid,
      );
      if (!user)
        throw new NotFoundError(
          `User ${notificationDto.uuid} no encontrado`,
        );
      const payload = { ...req.body, uuid: uuidv4(), user };
      const created = await this.notificationService.create(payload);

      const info = await this.emailerService.sendMail({
        to: user.email,
        subject: notificationDto.title,
        bodyType: notificationDto.bodyType,
        body: notificationDto.body,
        attachments: notificationDto.attachments || undefined,
      });
      res.status(201).json({ success: true, data: created, info });
    } catch (err: any) {
      next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const partial = req.body as Partial<INotificacion>;
      const updated = await this.notificationService.update(uuid, partial);
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
    next: NextFunction,
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
