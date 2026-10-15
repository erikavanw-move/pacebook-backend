# Sistema Backend de Turnos y Reservas — Pacebook

API REST con Node.js, Express y persistencia en archivos JSON, organizada en
una **arquitectura en capas**: router → controller → service → repository → DAO.

## Variables de entorno

Creá un archivo `.env` en la raíz (podés copiar `.env.example`):

PORT=8080
NODE_ENV=development

## Ejecución

Levanta el servidor en `http://localhost:8080`
Los datos persisten en `src/data/services.json` y `src/data/bookings.json`.

## Arquitectura en capas

Cada request atraviesa las capas en este orden, y cada capa solo habla con la
que tiene inmediatamente debajo:

Router → Controller → Service → Repository → DAO → archivo JSON

| Capa           | Carpeta             | Responsabilidad                                                                 |
| -------------- | ------------------- | -------------------------------------------------------------------------------- |
| **Router**     | `src/routes/`       | Define los endpoints y los conecta con su controller. Sin lógica.                |
| **Controller** | `src/controllers/`  | Lee `req` (params, query, body), llama al service y responde con `res.status().json()`. |
| **Service**    | `src/services/`     | Contiene las reglas de negocio (validaciones, filtros, `quantity`). No conoce `req` ni `res`. |
| **Repository** | `src/repositories/` | Ofrece métodos de acceso a datos (`getAll`, `getById`, `create`, ...). Sin reglas de negocio. |
| **DAO**        | `src/dao/`          | Lee y escribe directamente en el archivo JSON. Sin lógica de negocio.            |

### Por qué esta separación

- Cambiar **cómo se guardan** los datos (ejemplo, pasar de JSON a MongoDB) solo afecta al DAO (y eventualmente al repository).
- Las **reglas de negocio** viven en un único lugar (los services), sin mezclarse con HTTP ni con archivos.
- Cada capa se puede entender, probar y modificar por separado.

### Dónde está cada regla de negocio

- Validación de campos requeridos al crear servicios y reservas → `services.service.js` / `bookings.service.js`
- El `id` nunca se toma del body → `services.service.js`
- Filtros `?category=` y `?available=` → `services.service.js`
- Si un servicio se agrega dos veces a una reserva, se incrementa `quantity` → `bookings.service.js`
- Validar que existan la reserva y el servicio antes de agregarlo → `bookings.service.js`

### Estructura

src/
├── config/
│   └── env.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── services/
│   ├── services.service.js
│   └── bookings.service.js
├── repositories/
│   ├── services.repository.js
│   └── bookings.repository.js
├── dao/
│   ├── services.dao.js
│   └── bookings.dao.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
├── data/
│   ├── services.json
│   └── bookings.json
├── app.js
└── server.js


### Funciones por capa

| Recurso    | Controller y Service         | Repository y DAO       |
| `services` | `getServices`, `getServiceById`, `createService`, `updateService`, `deleteService` | `getAll`, `getById`, `create`, `update`, `delete` |
| `bookings` | `createBooking`, `getBookingById`, `addServiceToBooking`   | `create`, `getById`, `update`    |

## Endpoints

### `services`

{
  "id": 1,
  "name": "Running",
  "description": "Mejorá tu técnica de carrera con entrenadores especializados.",
  "duration": 60,
  "price": 5000,
  "category": "cardio",
  "available": true
}


| Método | Ruta                 | Comportamiento                                                                      |
| ------ | -------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/api/services`      | Devuelve todos los servicios. Filtros opcionales: `?category=cardio`, `?available=true` |
| GET    | `/api/services/:sid` | Devuelve un servicio por id. `200` si existe, `404` si no                            |
| POST   | `/api/services`      | Crea un servicio. `id` generado automáticamente. `201` si se crea, `400` si faltan campos |
| PUT    | `/api/services/:sid` | Actualiza un servicio. No permite modificar el `id`. `200` si existe, `404` si no    |
| DELETE | `/api/services/:sid` | Elimina un servicio. `200` si existe, `404` si no                                    |

### `bookings`

{
  "id": 1,
  "clientName": "Ana García",
  "clientEmail": "ana@email.com",
  "date": "2026-09-25",
  "time": "09:00",
  "status": "pending",
  "services": [
    { "service": 1, "quantity": 2 }
  ]
}


| Método | Ruta                          |Comportamiento    |
| POST   | `/api/bookings`               | Crea una reserva. Puede iniciarse con `services` vacío. `201` si se crea, `400` si faltan campos |
| GET    | `/api/bookings/:bid`          | Devuelve una reserva por id. `200` si existe, `404` si no |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva existente. Si ya estaba, incrementa `quantity`. `200` si ambos existen, `404` si la reserva o el servicio no existen |
