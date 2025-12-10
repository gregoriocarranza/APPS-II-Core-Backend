import { buildDomainEvent, DomainEvent } from "./rabbitMq/Publisher";
import userService from "./service/user.service";

export async function testHandleUserCreated() {
  const payload = {
    user_id: "19a70685-c3dc-47fe-a562-f33fdfd888a3",
    nombre: "Gregorio",
    apellido: "Carranza Torres",
    legajo: "USR775665",
    dni: "12345566",
    email_institucional: "gcarranzatorres6@campusconnect.edu.ar",
    id_rol: "a7f2e92e-2d43-4942-9f0b-fe2072ab2304",
    status: true,
  };

  const event: DomainEvent<typeof payload> = buildDomainEvent(
    "user.created",
    payload
  );

  await userService.handleUserCreated(event);
}
