# RabbitMQ Worker - Guía Rápida

## Cómo Levantar el Worker

### 1. Prerrequisitos

Asegúrate de tener los servicios corriendo:

```bash
# Levantar RabbitMQ y PostgreSQL
docker-compose up -d
```

Verifica que tu archivo `.env` tenga estas variables:

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
RABBITMQ_NOTIFICATIONS_QUEUE=core.queue
RABBITMQ_BACKOFFICE_QUEUE=backoffice.queue
```

### 2. Ejecutar el Worker

**Modo Desarrollo** (con auto-reload):

```bash
npm run dev:worker
```

**Modo Producción**:

```bash
npm run build
npm run start:worker
```

### 3. Verificar que Funciona

Deberías ver en la consola:

```
[Worker] RabbitMQ consumers initialised
[RabbitMQ] Consuming queue "core.queue"
[RabbitMQ] Consuming queue "backoffice.queue"
```

También puedes verificar en RabbitMQ Admin UI:

- **URL**: http://localhost:15672
- **Usuario**: guest
- **Contraseña**: guest

---

## Troubleshooting Rápido

**Error de conexión a RabbitMQ:**

```bash
# Verifica que RabbitMQ esté corriendo
docker ps | grep rabbitmq

# Si no está, levántalo
docker-compose up -d rabbitmq
```

**Error de base de datos:**

```bash
# Verifica que PostgreSQL esté corriendo
docker ps | grep postgres

# Si no está, levántalo
docker-compose up -d mi-postgres
```

**Para ver logs de RabbitMQ:**

```bash
docker logs -f rabbitmq
```

**Para detener el worker:**

- Presiona `Ctrl + C` (shutdown graceful automático)

---

## ¿Qué hace el Worker?

- **NotificationsConsumer**: Procesa y envía emails desde la cola `core.queue`
- **BackofficeUsersConsumer**: Sincroniza usuarios desde Backoffice en la cola `backoffice.queue`

El worker se ejecuta independientemente del servidor HTTP principal.

---

📖 Para más detalles, consulta [rabbit_worker.md](./rabbit_worker.md)
