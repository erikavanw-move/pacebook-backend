# Sistema Backend de Turnos y Reservas — Pacebook

API REST con Node.js, Express y **MongoDB Atlas (Mongoose)**, organizada en una
arquitectura en capas: router → controller → service → repository → DAO.

En esta versión la persistencia pasó de archivos JSON a MongoDB. Los endpoints
y su comportamiento externo se mantienen; lo único que cambió es cómo se
guardan y consultan los datos (solo se modificó la capa DAO y se agregaron los
modelos).

## Vistas (Handlebars) y tiempo real (Socket.io)

Además de la API REST, el servidor renderiza vistas con **Handlebars** y usa
**Socket.io** para actualizarlas sin recargar la página.

| Vista                 | Qué muestra                                                                 |
| --------------------- | ---------------------------------------------------------------------------- |
| `GET /views/services` | Servicios desde MongoDB (nombre, descripción, duración, precio, categoría, disponibilidad). Permite crear, cambiar disponibilidad y eliminar servicios |
| `GET /views/bookings` | Reservas desde MongoDB con los servicios de cada una                         |

Las vistas usan las mismas capas que la API (`views.controller` → service → repository → DAO → model); no tienen datos hardcodeados.

**Eventos en tiempo real.** Cuando un controller de la API completa una acción con éxito, emite un evento con `req.app.get("io")`, y `src/public/js/socket.js` lo escucha y actualiza la vista:

| Acción (API REST)                          | Evento            |
| ------------------------------------------ | ----------------- |
| `POST /api/services`                       | `service:created` |
| `PUT /api/services/:sid` (ej. `available`) | `service:updated` |
| `DELETE /api/services/:sid`                | `service:deleted` |
| `POST /api/bookings`                       | `booking:created` |
| `POST /api/bookings/:bid/services/:sid`    | `booking:updated` |

Para probarlo: abrir `/views/services` y `/views/bookings` en el navegador y
hacer las acciones desde Postman o desde el formulario de la propia vista.

También se sumó `GET /api/bookings` (todas las reservas).


## Variables de entorno

Creá un archivo `.env` en la raíz (podés copiar `.env.example`):

PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/pacebook?retryWrites=true&w=majority


| Variable    | Descripción                                                        |
| ----------- | ------------------------------------------------------------------- |
| `PORT`      | Puerto donde corre el servidor                                      |
| `NODE_ENV`  | Entorno de ejecución (`development`, `production`)                  |
| `MONGO_URI` | URI de conexión a MongoDB Atlas (incluye usuario, contraseña y nombre de la base) |

Si falta alguna variable, la app no arranca y muestra cuál falta. 

## Configurar MongoDB Atlas

1. Crear un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas).
2. En **Database Access**, crear un usuario con contraseña.
3. En **Network Access**, permitir el acceso desde tu IP.
4. En **Connect → Drivers**, copiar la cadena de conexión, reemplazar `<password>` y agregar el nombre de la base (en mi caso se llama `pacebook`).
5. Pegarla en `.env` como `MONGO_URI`.


## Arquitectura en capas

Router → Controller → Service → Repository → DAO → MongoDB (Mongoose)

| Capa           | Carpeta             | Responsabilidad                                                                 |
| -------------- | ------------------- | -------------------------------------------------------------------------------- |
| **Router**     | `src/routes/`       | Define los endpoints y los conecta con su controller. Sin lógica.                |
| **Controller** | `src/controllers/`  | Lee `req` (params, query, body), llama al service y responde con `res.status().json()`. |
| **Service**    | `src/services/`     | Reglas de negocio (validaciones, filtros, `quantity`). No conoce `req` ni `res`. |
| **Repository** | `src/repositories/` | Métodos de acceso a datos (`getAll`, `getById`, `create`, ...). Sin reglas de negocio. |
| **DAO**        | `src/dao/`          | Consultas a MongoDB con los modelos de Mongoose. Sin lógica de negocio.          |
| **Model**      | `src/models/`       | Esquemas de Mongoose de cada colección.                                          |

Gracias a esta separación, migrar de JSON a MongoDB solo requirió reescribir
los DAO y sumar los modelos y la conexión: routers, controllers, services y
repositories siguen igual.

### Estructura

src/
├── config/
│   ├── env.config.js
│   └── db.config.js
├── models/
│   ├── service.model.js
│   ├── booking.model.js
│   ├── message.model.js
│   └── schema.options.js
├── controllers/
├── services/
├── repositories/
├── dao/
├── routes/
├── views/                  (Handlebars: layouts/main + services + bookings)
├── public/                 (css/styles.css, js/socket.js)
├── scripts/
│   └── seed.js
├── data/
│   └── services.json      (datos iniciales para el seed)
├── app.js
└── server.js

## Modelos

### `Service` (colección `services`)

| Campo         | Tipo    | Notas                    |
| ------------- | ------- | ------------------------ |
| `name`        | String  | requerido                |
| `description` | String  | requerido                |
| `duration`    | Number  | requerido                |
| `price`       | Number  | requerido                |
| `category`    | String  | requerido                |
| `available`   | Boolean | requerido                |

### `Booking` (colección `bookings`)

| Campo         | Tipo                                    | Notas                                 |
| ------------- | --------------------------------------- | ------------------------------------- |
| `clientName`  | String                                  | requerido                             |
| `clientEmail` | String                                  | requerido                             |
| `date`        | String                                  | requerido                             |
| `time`        | String                                  | requerido                             |
| `status`      | String                                  | por defecto `pending`                 |
| `services`    | `[{ service: ObjectId, quantity: Number }]` | `service` referencia a `Service`; no se guarda el servicio completo |

### `Message` (colección `messages`)

| Campo     | Tipo   | Notas     |
| --------- | ------ | --------- |
| `user`    | String | requerido |
| `message` | String | requerido |

Incluye `createdAt` y `updatedAt` automáticos. El modelo está definido para las
próximas etapas del proyecto.

> **Ids:** MongoDB genera un `ObjectId` (texto de 24 caracteres) para cada
> documento. La API lo devuelve como `id`. Un id con formato inválido o que no
> existe responde `404`.

## Endpoints

### `services`

| Método | Ruta                 | Comportamiento                                                                      |
| ------ | -------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/api/services`      | Devuelve todos los servicios. Filtros opcionales: `?category=cardio`, `?available=true` |
| GET    | `/api/services/:sid` | Devuelve un servicio por id. `200` si existe, `404` si no                            |
| POST   | `/api/services`      | Crea un servicio. El `id` lo genera MongoDB. `201` si se crea, `400` si faltan campos o son inválidos |
| PUT    | `/api/services/:sid` | Actualiza un servicio. No permite modificar el `id`. `200` si existe, `404` si no    |
| DELETE | `/api/services/:sid` | Elimina un servicio. `200` si existe, `404` si no                                    |

### `bookings`

| Método | Ruta       | Comportamiento                                                              |
| ------ | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| GET    | `/api/bookings`                    | Devuelve todas las reservas con el detalle de cada servicio                                       |
| POST   | `/api/bookings`                    | Crea una reserva. Puede iniciarse con `services` vacío. `201` si se crea, `400` si faltan campos    |
| GET    | `/api/bookings/:bid`               | Devuelve una reserva por id. `200` si existe, `404` si no                                          |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva existente. Si ya estaba, incrementa `quantity`. `200` si ambos existen, `404` si la reserva o el servicio no existen |

### Ejemplo de reserva

json
{
  "id": "6720a1f4c3b2a91d5e8f4a10",
  "clientName": "Ana García",
  "clientEmail": "ana@email.com",
  "date": "2026-11-05",
  "time": "09:00",
  "status": "pending",
  "services": [
    { "service": "6720a1f4c3b2a91d5e8f4a01", "quantity": 2 }
  ]
}

