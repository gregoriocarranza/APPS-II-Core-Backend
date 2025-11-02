import { ConsumeMessage } from "amqplib";
import BaseConsumer from "../consumer.base";
import rabbitConfig from "../../config/rabbit.config";
import { UserService } from "../../service/user.service";
import { NotFoundError } from "../../common/utils/errors";
import {
  UserCreatedEventDTO,
  // UserDeletedEventDTO,
  unwrapPayload,
} from "../../common/dto/user/user-events.dto";

type BackofficeMessage = Record<string, unknown>;

export class BackofficeUsersConsumer extends BaseConsumer<BackofficeMessage> {
  private readonly userService = new UserService();

  constructor(queueName: string = rabbitConfig.queues.backofficeUsers) {
    super(queueName);
  }

  protected override async onMessage(
    payload: BackofficeMessage,
    message: ConsumeMessage
  ): Promise<void> {
    await this.handleUserCreated(payload, message);

    // const routingKey = message.fields.routingKey;

    // switch (routingKey) {
    //   case "user.created":
    //     await this.handleUserCreated(payload, message);
    //     break;
    //   case "user.deleted":
    //     await this.handleUserDeleted(payload, message);
    //     break;
    //   default:
    //     console.warn(
    //       `[RabbitMQ] Unsupported routing key "${routingKey}" on queue "${this.getQueueName()}". Message acknowledged.`,
    //     );
    // }
  }

  private async handleUserCreated(
    payload: BackofficeMessage,
    message: ConsumeMessage
  ): Promise<void> {
    const userData = UserCreatedEventDTO.build(
      unwrapPayload(payload, ["payload", "data"])
    );

    try {
      await this.userService.update(userData.uuid, userData);
      console.info(
        `[RabbitMQ] User updated from event user.created (uuid: ${userData.uuid}, message id: ${
          message.properties.messageId ?? "N/A"
        })`
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        await this.userService.create(userData);
        console.info(
          `[RabbitMQ] User created from event user.created (uuid: ${userData.uuid}, message id: ${
            message.properties.messageId ?? "N/A"
          })`
        );
        return;
      }

      throw error;
    }
  }

  // private async handleUserDeleted(
  //   payload: BackofficeMessage,
  //   message: ConsumeMessage
  // ): Promise<void> {
  //   const deletedDto = UserDeletedEventDTO.build(
  //     unwrapPayload(payload, ["payload", "data"])
  //   );

  //   try {
  //     await this.userService.delete(deletedDto.uuid);
  //     console.info(
  //       `[RabbitMQ] User deleted from event user.deleted (uuid: ${deletedDto.uuid}, message id: ${
  //         message.properties.messageId ?? "N/A"
  //       })`
  //     );
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       console.warn(
  //         `[RabbitMQ] user.deleted received but user ${deletedDto.uuid} not found. Acknowledging message.`
  //       );
  //       return;
  //     }
  //     throw error;
  //   }
  // }
}

export default BackofficeUsersConsumer;
