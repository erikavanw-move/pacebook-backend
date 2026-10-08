# Sistema Backend de Turnos y Reservas — Pacebook

API REST con Node.js, Express y persistencia en archivos JSON (FileSystem),
organizada en tres capas: **routes → controllers → managers**.


## Variables de entorno

Creá un archivo `.env` en la raíz (podés copiar `.env.example`):

```
PORT=8080
NODE_ENV=development
```

## Ejecución

Levanta el servidor en `http://localhost:8080`
Los datos persisten en `src/data/services.json` y `src/data/bookings.json`.

## Arquitectura

Esta entrega reorganiza el código existente en tres capas con responsabilidades separadas.

- **`src/routes/`** — define los endpoints y los conecta con su controller. No contiene lógica de negocio ni acceso a archivos.
- **`src/controllers/`** — lee `req.params`, `req.query` y `req.body`, llama al manager correspondiente y responde con `res.status().json()`. No accede a los archivos JSON directamente.
- **`src/managers/`** — maneja la lógica de datos y la persistencia en JSON, con lecturas y escrituras asíncronas (`fs/promises` + `async/await`). Nunca usa `req` ni `res`.
- **`src/app.js`** — configura Express, sin lógica de negocio.
- **`src/server.js`** — arranca el servidor, leyendo el puerto desde `.env`.

src/
├── config/
│   └── env.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
├── data/
│   ├── services.json
│   └── bookings.json
├── app.js
└── server.js


## Recurso `services`

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

## Recurso `bookings`

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

| Método | Ruta                                | Comportamiento    |
| POST   | `/api/bookings`                     | Crea una reserva. Puede iniciarse con `services` vacío. `201` si se crea, `400` si faltan campos.
| GET    | `/api/bookings/:bid`                | Devuelve una reserva por id. `200` si existe, `404` si no.
| POST   | `/api/bookings/:bid/services/:sid`   | Agrega un servicio a una reserva existente. Si ya estaba, incrementa `quantity`. `200` si ambos existen, `404` si la reserva o el servicio no existen.