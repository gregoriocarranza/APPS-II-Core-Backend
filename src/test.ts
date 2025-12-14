import { enumTemplateKey } from "./common/templates";
import { buildDomainEvent, DomainEvent } from "./rabbitMq/Publisher";
import NotificationsService from "./service/notifications.service";
// import userService from "./service/user.service";

export async function testHandlerEventCreated() {
  const payload = {
    userId: "7d66a908-04c1-4a97-bc65-aef34d4dff8d",
    event: {
      id: "8d08b0cc-5cb1-4695-83f0-561e1bb75101",
      name: "Conferencia de F1",
      startTime: "2026-01-01T09:00:00.000+00:00",
      endTime: "2026-01-01T17:00:00.000+00:00",
      location: {
        id: "1b1eff2f-2233-4b0a-b00c-62cb27137bee",
        name: "Auditorio 1 - UADE - microcentro",
        address: "Independencia 50",
        capacity: 200,
      },
      description: "Evento sobre las últimas tendencias en tecnología.",
      price: 50.0,
      availableSeats: 0,
      registered: null,
      imageUrl: null,
    },
    enrollmentDate: "2025-12-10T04:44:41.088+00:00",
    paymentStatus: "APPROVED",
  };

  const event: DomainEvent<typeof payload> = buildDomainEvent(
    "keyBinding",
    payload
  );

  await NotificationsService.handleNotificationCreated(
    event,
    enumTemplateKey.EVENTOS_ACADEMICOS
  );
}
