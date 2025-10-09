import { Request, Response, NextFunction } from "express";
import { IBaseController } from "../../types";
import notificationsService, { NotificationsService } from "../../service/notifications.service";
import { NotFoundError } from "../../common/utils/errors";
import { v4 as uuidv4 } from "uuid";
import { INotificacion } from "../../database/interfaces/notification/notification.interfaces";
import { NotificationCreatedDTO } from "../../common/dto/notificaciones.dto";
import { inputValidator} from "../../common/helpers/validate.dto";

export class NotificationsController implements IBaseController {
  constructor(private service: NotificationsService = notificationsService) {}

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
        const data = await this.service.getByUserId({user_id,
        page: page ? +page : 1,
        limit: limit ? +limit : 20,
      });
      res.status(200).json(data);
        return;
      }

      const result = await this.service.getAll({
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
      const wallet = await this.service.getByUuid(uuid);
      res.status(200).json({ success: true, data: wallet });
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
      const notificationDto = new NotificationCreatedDTO(req.body);

      const isValid = await inputValidator(notificationDto);
      if (!isValid) return res.status(400).json({ error: "Datos inválidos" });


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
    next: NextFunction,
  ): Promise<void> {
    try {
      const { uuid } = req.params;
      const partial = req.body as Partial<INotificacion>;
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
    next: NextFunction,
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
