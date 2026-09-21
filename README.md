# Sistema Backend de Turnos y Reservas — Pacebook

API REST con Node.js, Express y persistencia en archivos JSON (FileSystem)
para los recursos `services` y `bookings`.


## Variables de entorno

Archivo `.env` en la raíz (podés copiar `.env.example`):

PORT=8080
NODE_ENV=development

## Ejecución

Levanta el servidor en `http://localhost:8080` 
Los datos se guardan en `src/data/services.json` y
`src/data/bookings.json`, no se pierden al reiniciar el servidor.

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


| Método | Ruta                 | Comportamiento                                                                      |
| POST   | `/api/bookings` | Crea una reserva. Puede iniciarse con `services` vacío. `201` si se crea, `400` si faltan  campos |
| GET    | `/api/bookings/:bid`  | Devuelve una reserva por id. `200` si existe, `404` si no  |
| POST   | `/api/bookings/:bid/services/:sid`   | Agrega un servicio a una reserva existente. Si ya estaba, incrementa `quantity`. `200` si ambos existen, `404` si la reserva o el servicio no existen |


### Ejemplos

# Crear una reserva vacía
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Ana García","clientEmail":"ana@email.com","date":"2026-09-25","time":"09:00"}'

# Ver una reserva
curl http://localhost:8080/api/bookings/1

# Agregar el servicio con id 1 a la reserva 1
curl -X POST http://localhost:8080/api/bookings/1/services/1


## Arquitectura

- `src/config/env.config.js` — valida y expone las variables de entorno
- `src/managers/ServiceManager.js` — lógica de negocio del recurso `services`, persiste en `services.json`
- `src/managers/BookingManager.js` — lógica de negocio del recurso `bookings`, persiste en `bookings.json`
- `src/routes/services.router.js` — rutas de `services` con `express.Router()`
- `src/routes/bookings.router.js` — rutas de `bookings` con `express.Router()`; valida contra `ServiceManager` que el servicio exista antes de agregarlo a una reserva
- `src/app.js` — configura la app de Express
- `src/server.js` — arranca el servidor, leyendo el puerto desde `.env`
