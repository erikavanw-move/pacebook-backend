# Sistema Backend de Turnos y Reservas — API de Services

API REST con Express que expone endpoints para gestionar el recurso
`services`, construida sobre el `ServiceManager` de la entrega anterior.

## Variables de entorno

Crear archivo `.env`

PORT=8080
NODE_ENV=development

Levanta el servidor en `http://localhost:8080` 

## Endpoints

| Método | Ruta                 | Comportamiento                                                  |

| GET    | `/api/services`      | Devuelve todos los servicios. Filtros opcionales: `?category=cardio`, `?available=true` |
| GET    | `/api/services/:sid` | Devuelve el servicio por id. `200` si existe, `404` si no          |
| POST   | `/api/services`      | Crea un servicio con los datos del body. `id` generado automáticamente. `201` si se crea, `400` si faltan campos |
| PUT    | `/api/services/:sid` | Actualiza el servicio. No permite modificar el `id`. `200` si existe, `404` si no |
| DELETE | `/api/services/:sid` | Elimina el servicio. `200` si existe, `404` si no                  |

### Ejemplos

# Todos los servicios
curl http://localhost:8080/api/services

# Filtrar por categoría
curl "http://localhost:8080/api/services?category=cardio"

# Filtrar por disponibilidad
curl "http://localhost:8080/api/services?available=true"

# Ambos filtros combinados
curl "http://localhost:8080/api/services?category=cardio&available=true"

# Un servicio puntual
curl http://localhost:8080/api/services/1

# Crear un servicio
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Yoga","description":"Clases de yoga","duration":60,"price":4000,"category":"movilidad","available":true}'

# Actualizar un servicio (solo los campos que cambian)
curl -X PUT http://localhost:8080/api/services/1 \
  -H "Content-Type: application/json" \
  -d '{"price":5500}'

# Eliminar un servicio
curl -X DELETE http://localhost:8080/api/services/5


## Arquitectura

- `src/config/env.config.js` — valida y expone las variables de entorno
- `src/managers/ServiceManager.js` — toda la lógica de negocio del recurso `services` (sin cambios respecto a la entrega anterior)
- `src/routes/services.router.js` — define las rutas con `express.Router()` y las conecta con `ServiceManager`
- `src/app.js` — configura la app de Express (middlewares y montaje de rutas), sin lógica de negocio
- `src/server.js` — arranca el servidor, leyendo el puerto desde `.env`
