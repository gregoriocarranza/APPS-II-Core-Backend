import { enumTemplateKey } from "./common/templates";
import { buildDomainEvent, DomainEvent } from "./rabbitMq/Publisher";
import RabbitMQService from "./service/rabbitMq.service";

// import userService from "./service/user.service";

export async function testHandlerEventCreated() {
  const payload = {
    sanctionId: "c2a2643e-c2ab-49c3-a7bf-6474d1576f0e",
    userId: "389daee3-a145-48e3-86b8-028ad2a5dff7",
    parameterId: "8c70b0fa-f5aa-4051-a73c-e1da8e8693c4",
    amount: "15000.00",
    status: "PENDING",
    createdAt: "2025-12-16T21:43:28.528Z",
    source: "BIBLIOTECA",
  };

  const event: DomainEvent<typeof payload> = buildDomainEvent(
    "sanctions.created",
    payload
  );

  await RabbitMQService.handleSanctionNotificationCreated(
    event,
    enumTemplateKey.SANCION_BIBLIOTECA
  );
}
