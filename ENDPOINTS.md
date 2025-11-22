# 📚 Documentación de Endpoints - API de Películas

Esta API RESTful permite gestionar usuarios, películas y favoritos. Todos los endpoints están documentados automáticamente en `/docs` (Swagger UI) y `/redoc` (ReDoc).

## 🚀 Información General

- **Base URL**: `http://localhost:8000`
- **Documentación Interactiva**: `http://localhost:8000/docs`
- **Documentación Alternativa**: `http://localhost:8000/redoc`

---

## 📋 Índice

1. [Endpoints Raíz y Health](#endpoints-raíz-y-health)
2. [Usuarios](#usuarios)
3. [Películas](#películas)
4. [Favoritos](#favoritos)
5. [Integración TMDB](#integración-tmdb)

---

## 🏠 Endpoints Raíz y Health

### GET `/`
Obtiene información básica de la API.

**Respuesta:**
```json
{
  "nombre": "pelimaniaticos",
  "version": "1.0.1",
  "descripcion": "API RESTful para gestionar usuarios, películas y favoritos",
  "documentacion": "/docs",
  "documentacion_alternativa": "/redoc",
  "endpoints": {
    "usuarios": "/api/usuarios",
    "peliculas": "/api/peliculas",
    "favoritos": "/api/favoritos"
  }
}
```

### GET `/health`
Verifica el estado de la API y la conexión a la base de datos.

**Respuesta:**
```json
{
  "status": "healthy",
  "timestamp": 1700000000.0,
  "database": "healthy",
  "environment": "development",
  "version": "1.0.1"
}
```

---

## 👥 Usuarios

### GET `/api/usuarios/`
Lista todos los usuarios con paginación.

**Query Parameters:**
- `page` (int, default: 1): Número de página
- `limit` (int, default: 10, max: 100): Elementos por página

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8000/api/usuarios/?page=1&limit=10"
```

**Respuesta:**
```json
{
  "items": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@email.com",
      "fecha_registro": "2025-11-17T10:30:00"
    }
  ],
  "total_records": 50,
  "current_pg": 1,
  "limit": 10,
  "pages": 5,
  "has_next": true,
  "has_prev": false,
  "next_page": 2,
  "prev_page": null
}
```

### POST `/api/usuarios/`
Crea un nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@email.com"
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "fecha_registro": "2025-11-17T10:30:00"
}
```

### POST `/api/usuarios/login` (Endpoint de ejemplo - no implementado)
Autentica un usuario en la plataforma.

**Nota:** Este endpoint requiere implementación de autenticación (JWT, OAuth2, etc.)

**Body:**
```json
{
  "correo": "juan@email.com",
  "contraseña": "password123"
}
```

**Respuesta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@email.com"
  }
}
```

**Respuesta de error (401 Unauthorized):**
```json
{
  "detail": "Credenciales incorrectas"
}
```

### GET `/api/usuarios/{usuario_id}`
Obtiene un usuario específico por ID.

**Ejemplo:**
```bash
curl -X GET "http://localhost:8000/api/usuarios/1"
```

### PUT `/api/usuarios/{usuario_id}`
Actualiza la información de un usuario.

**Body (todos los campos opcionales):**
```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "juancarlos@email.com"
}
```

### DELETE `/api/usuarios/{usuario_id}`
Elimina un usuario (también elimina sus favoritos).

**Respuesta:** 204 No Content

### GET `/api/usuarios/{usuario_id}/favoritos`
Lista todas las películas favoritas de un usuario.

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2025-11-17T10:00:00",
    "image_url": null
  }
]
```

### POST `/api/usuarios/{usuario_id}/favoritos/{pelicula_id}`
Marca una película como favorita para un usuario.

**Respuesta (201 Created):**
```json
{
  "message": "Pelicula agregada a favoritos"
}
```

### DELETE `/api/usuarios/{usuario_id}/favoritos/{pelicula_id}`
Elimina una película de los favoritos de un usuario.

**Respuesta:** 204 No Content

### GET `/api/usuarios/{usuario_id}/estadisticas`
Obtiene estadísticas detalladas del usuario.

**Respuesta:**
```json
{
  "usuario_id": 1,
  "nombre_usuario": "Juan Pérez",
  "total_favoritos": 15,
  "duracion_total_minutos": 2340,
  "duracion_total_horas": 39.0,
  "generos_favoritos": [
    {"genero": "Acción", "cantidad": 5},
    {"genero": "Ciencia Ficción", "cantidad": 4}
  ],
  "directores_favoritos": [
    {"director": "Christopher Nolan", "cantidad": 3}
  ],
  "decada_favorita": {
    "decada": "2010s",
    "cantidad": 8
  },
  "clasificacion_mas_vista": {
    "clasificacion": "PG-13",
    "cantidad": 6
  },
  "promedio_duracion": 156.0
}
```

---

## 🎬 Películas

### GET `/api/peliculas/`
Lista todas las películas con paginación.

**Query Parameters:**
- `skip` (int, default: 0): Registros a omitir
- `limit` (int, default: 100): Máximo de registros

**Ejemplo:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/?skip=0&limit=20"
```

### POST `/api/peliculas/`
Crea una nueva película.

**Body:**
```json
{
  "titulo": "Inception",
  "director": "Christopher Nolan",
  "genero": "Ciencia Ficción, Acción",
  "duracion": 148,
  "año": 2010,
  "clasificacion": "PG-13",
  "sinopsis": "Un ladrón que roba secretos mediante tecnología de sueños..."
}
```

**Validaciones:**
- `duracion`: Entre 1 y 600 minutos
- `año`: Entre 1888 y el año actual
- `clasificacion`: G, PG, PG-13, R, NC-17, NR, ATP, +13, +16, +18

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "titulo": "Inception",
  "director": "Christopher Nolan",
  "genero": "Ciencia Ficción, Acción",
  "duracion": 148,
  "año": 2010,
  "clasificacion": "PG-13",
  "sinopsis": "Un ladrón que roba secretos...",
  "fecha_creacion": "2025-11-17T10:00:00",
  "image_url": null
}
```

### GET `/api/peliculas/{pelicula_id}`
Obtiene una película específica por ID.

### PUT `/api/peliculas/{pelicula_id}`
Actualiza la información de una película (todos los campos son opcionales).

### DELETE `/api/peliculas/{pelicula_id}`
Elimina una película (también elimina los favoritos asociados).

**Respuesta:** 204 No Content

### POST `/api/peliculas/{pelicula_id}/imagen`
Carga una imagen para una película específica.

**Path Parameters:**
- `pelicula_id` (int): ID de la película

**Body (multipart/form-data):**
- `imagen` (file): Archivo de imagen

**Formatos aceptados:**
- image/jpeg
- image/png
- image/jpg
- image/webp

**Restricciones:**
- Tamaño máximo: 5 MB

**Ejemplo con cURL:**
```bash
curl -X POST "http://localhost:8000/api/peliculas/1/imagen" \
  -H "Content-Type: multipart/form-data" \
  -F "imagen=@/ruta/a/tu/imagen.jpg"
```

**Respuesta (200 OK):**
```json
{
  "message": "Imagen subida exitosamente",
  "image_url": "/api/peliculas/imagen/1",
  "pelicula_id": 1
}
```

**Errores posibles:**
- **404**: Película no encontrada
- **400**: Tipo de archivo no permitido o tamaño excedido
- **500**: Error al procesar la imagen

### GET `/api/peliculas/imagen/{pelicula_id}`
Obtiene la imagen de una película en formato binario.

**Path Parameters:**
- `pelicula_id` (int): ID de la película

**Respuesta:**
- **Content-Type**: `image/jpeg`
- **Headers**: 
  - `Content-Disposition`: inline; filename=pelicula_{id}.jpg
  - `Cache-Control`: public, max-age=3600

**Ejemplo:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/imagen/1" --output pelicula.jpg
```

**Errores posibles:**
- **404**: Película no encontrada o no tiene imagen asociada

### GET `/api/peliculas/buscar/`
Busca películas según diferentes criterios (todos los parámetros son opcionales y combinables).

**Query Parameters:**
- `titulo` (string): Buscar por título
- `director` (string): Buscar por director
- `genero` (string): Buscar por género
- `año` (int): Buscar por año específico
- `año_min` (int): Año mínimo
- `año_max` (int): Año máximo

**Ejemplo:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/buscar/?genero=Acción&año_min=2010"
```

### GET `/api/peliculas/populares/top`
Obtiene las películas más populares basado en número de favoritos.

**Query Parameters:**
- `limit` (int, default: 10, max: 50): Número de películas a retornar

**Ejemplo:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/populares/top?limit=5"
```

### GET `/api/peliculas/clasificacion/{clasificacion}`
Obtiene películas filtradas por clasificación de edad.

**Clasificaciones válidas:** G, PG, PG-13, R, NC-17

**Query Parameters:**
- `limit` (int, default: 100): Máximo de películas

### GET `/api/peliculas/recientes/nuevas`
Obtiene las películas más recientes basado en fecha de creación.

**Query Parameters:**
- `limit` (int, default: 10, max: 50): Número de películas

---

## ⭐ Favoritos

### GET `/api/favoritos/`
Lista todos los favoritos con paginación.

**Query Parameters:**
- `page` (int, default: 1): Número de página
- `limit` (int, default: 10, max: 100): Elementos por página

**Respuesta:**
```json
{
  "items": [
    {
      "id": 1,
      "id_usuario": 1,
      "id_pelicula": 5,
      "fecha_marcado": "2025-11-17T10:30:00"
    }
  ],
  "total_records": 100,
  "current_pg": 1,
  "limit": 10,
  "pages": 10,
  "has_next": true,
  "has_prev": false,
  "next_page": 2,
  "prev_page": null
}
```

### POST `/api/favoritos/`
Marca una película como favorita.

**Body:**
```json
{
  "id_usuario": 1,
  "id_pelicula": 5
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "id_usuario": 1,
  "id_pelicula": 5,
  "fecha_marcado": "2025-11-17T10:30:00"
}
```

### GET `/api/favoritos/{favorito_id}`
Obtiene un favorito específico con detalles del usuario y película.

**Respuesta:**
```json
{
  "id": 1,
  "id_usuario": 1,
  "id_pelicula": 5,
  "fecha_marcado": "2025-11-17T10:30:00",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@email.com",
    "fecha_registro": "2025-11-17T09:00:00"
  },
  "pelicula": {
    "id": 5,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "...",
    "fecha_creacion": "2025-11-17T10:00:00",
    "image_url": null
  }
}
```

### DELETE `/api/favoritos/{favorito_id}`
Elimina un favorito específico.

**Respuesta:** 204 No Content

### GET `/api/favoritos/usuario/{usuario_id}`
Lista todos los favoritos de un usuario específico.

### GET `/api/favoritos/pelicula/{pelicula_id}`
Lista todos los usuarios que marcaron una película como favorita.

### GET `/api/favoritos/verificar/{usuario_id}/{pelicula_id}`
Verifica si una película es favorita de un usuario.

**Respuesta:**
```json
{
  "es_favorito": true,
  "favorito_id": 1,
  "fecha_marcado": "2025-11-17T10:30:00"
}
```

O si no es favorito:
```json
{
  "es_favorito": false
}
```

### GET `/api/favoritos/estadisticas/generales`
Obtiene estadísticas generales de favoritos en la plataforma.

**Respuesta:**
```json
{
  "total_favoritos": 150,
  "usuario_top": {
    "id": 5,
    "nombre": "María García",
    "cantidad_favoritos": 25
  },
  "pelicula_top": {
    "id": 10,
    "titulo": "The Shawshank Redemption",
    "cantidad_favoritos": 45
  },
  "genero_mas_popular": {
    "genero": "Drama",
    "cantidad": 60
  }
}
```

### DELETE `/api/favoritos/usuario/{usuario_id}/todos`
Elimina TODOS los favoritos de un usuario (⚠️ acción irreversible).

**Respuesta:** 204 No Content

### GET `/api/favoritos/recomendaciones/{usuario_id}`
Obtiene recomendaciones de películas basadas en los favoritos del usuario.

**Query Parameters:**
- `limit` (int, default: 5, max: 20): Número de recomendaciones

**Respuesta:**
```json
[
  {
    "id": 15,
    "titulo": "Interstellar",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 169,
    "año": 2014,
    "clasificacion": "PG-13",
    "sinopsis": "...",
    "fecha_creacion": "2025-11-17T10:00:00",
    "image_url": null
  }
]
```

---

## 🔧 Códigos de Estado HTTP

- **200 OK**: Petición exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Recurso eliminado exitosamente
- **400 Bad Request**: Error en los datos enviados
- **404 Not Found**: Recurso no encontrado
- **422 Unprocessable Entity**: Error de validación
- **500 Internal Server Error**: Error del servidor

---

## 🎨 Características Adicionales

### Middleware de Logging
Cada petición registra:
- Método HTTP
- Ruta
- Código de estado
- Tiempo de procesamiento (disponible en header `X-Process-Time`)

### Manejo de Errores
Todos los errores incluyen mensajes descriptivos y estructura consistente:
```json
{
  "detail": "Descripción del error"
}
```

### CORS
La API permite solicitudes desde cualquier origen en desarrollo. Configurable en producción mediante `cors_origins` en el archivo de configuración.

---

## 📝 Ejemplos Adicionales con cURL

### Crear un usuario y autenticarlo (Login)
```bash
# 1. Crear usuario
curl -X POST "http://localhost:8000/api/usuarios/" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ana López", "correo": "ana@email.com"}'

# 2. Login (endpoint de ejemplo - requiere implementación)
curl -X POST "http://localhost:8000/api/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"correo": "ana@email.com", "contraseña": "password123"}'
```
```bash
curl -X POST "http://localhost:8000/api/usuarios/" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ana López", "correo": "ana@email.com"}'
```

### Crear una película
```bash
curl -X POST "http://localhost:8000/api/peliculas/" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "The Matrix",
    "director": "Lana Wachowski, Lilly Wachowski",
    "genero": "Ciencia Ficción, Acción",
    "duracion": 136,
    "año": 1999,
    "clasificacion": "R",
    "sinopsis": "Un programador descubre que la realidad es una simulación..."
  }'
```

### Marcar película como favorita
```bash
curl -X POST "http://localhost:8000/api/usuarios/1/favoritos/5"
```

### Obtener estadísticas de usuario
```bash
curl -X GET "http://localhost:8000/api/usuarios/1/estadisticas"
```

### Buscar películas
```bash
curl -X GET "http://localhost:8000/api/peliculas/buscar/?genero=Acción&año_min=2000&año_max=2020"
```

### Obtener recomendaciones
```bash
curl -X GET "http://localhost:8000/api/favoritos/recomendaciones/1?limit=10"
```

---

## 🎬 Integración TMDB

Los siguientes endpoints permiten importar películas directamente desde The Movie Database (TMDB).

### GET `/api/peliculas/tmdb/populares`
Obtiene películas populares desde TMDB.

**Query Parameters:**
- `page` (int, default: 1, max: 500): Número de página de TMDB
- `importar` (bool, default: false): Si es true, importa las películas a la BD local

**Ejemplo - Solo consultar:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/populares?page=1"
```

**Ejemplo - Importar a BD:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/populares?page=1&importar=true"
```

**Respuesta (sin importar):**
```json
[
  {
    "titulo": "Inception",
    "director": "Director desconocido",
    "genero": "Ciencia Ficción, Acción",
    "duracion": 120,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "id": 27205,
    "image_url": "/path/to/poster.jpg"
  }
]
```

**Respuesta (con importar=true):**
```json
{
  "mensaje": "Se importaron 14 películas nuevas",
  "total_obtenidas": 20,
  "peliculas_importadas": [
    {
      "id": 22,
      "titulo": "Inception",
      "director": "Christopher Nolan",
      "genero": "Ciencia Ficción, Acción",
      "duracion": 148,
      "año": 2010,
      "clasificacion": "PG-13",
      "sinopsis": "Un ladrón que roba secretos...",
      "fecha_creacion": "2025-11-17T12:49:06.521976",
      "image_url": "/api/peliculas/imagen/22"
    }
  ]
}
```

### GET `/api/peliculas/tmdb/buscar`
Busca películas en TMDB por título.

**Query Parameters:**
- `query` (string, requerido): Término de búsqueda (mínimo 1 carácter)
- `page` (int, default: 1, max: 500): Número de página
- `importar` (bool, default: false): Si es true, importa las películas encontradas

**Ejemplo - Buscar:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/buscar?query=Matrix&page=1"
```

**Ejemplo - Buscar e importar:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/buscar?query=Inception&importar=true"
```

**Respuesta:** Similar al endpoint de películas populares

### POST `/api/peliculas/tmdb/importar/{tmdb_id}`
Importa una película específica desde TMDB usando su ID.

**Path Parameters:**
- `tmdb_id` (int, requerido): ID de la película en TMDB

**Ejemplo:**
```bash
# Importar "Fight Club" (TMDB ID: 550)
curl -X POST "http://localhost:8000/api/peliculas/tmdb/importar/550"
```

**Respuesta (201 Created):**
```json
{
  "id": 36,
  "titulo": "Fight Club",
  "director": "David Fincher",
  "genero": "Drama",
  "duracion": 139,
  "año": 1999,
  "clasificacion": "R",
  "sinopsis": "Un empleado de oficina insomne...",
  "fecha_creacion": "2025-11-17T13:15:00.123456",
  "image_url": "/api/peliculas/imagen/36"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "detail": "La película 'Fight Club' (1999) ya existe en la base de datos"
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "detail": "No se encontró película con ID 999999 en TMDB"
}
```

### 🔑 Configuración TMDB

Para usar los endpoints de TMDB, configura tu Bearer Token:

**Opción 1: Variable de entorno**
```bash
export TMDB_BEARER_TOKEN="eyJhbGciOiJIUzI1NiJ9..."
```

**Opción 2: Archivo .env**
```env
TMDB_BEARER_TOKEN=eyJhbGciOiJIUzI1NiJ9...
```

**Nota:** Un token por defecto está configurado en el código, pero se recomienda usar variables de entorno en producción.

### ✨ Características de la Integración TMDB

1. **Descarga automática de imágenes**: Las películas importadas incluyen sus posters
2. **Evita duplicados**: Verifica título + año antes de importar
3. **Detalles completos**: Obtiene director, géneros y toda la información disponible
4. **Transformación de datos**: Convierte automáticamente el formato de TMDB al esquema local
5. **Manejo de errores**: Respuestas claras cuando algo falla

### 📝 Ejemplos de Flujo de Trabajo TMDB

**1. Explorar películas populares sin importar:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/populares?page=1"
```

**2. Importar películas populares:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/populares?page=1&importar=true"
```

**3. Buscar una película específica:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/tmdb/buscar?query=Interstellar"
```

**4. Importar una película por su ID de TMDB:**
```bash
curl -X POST "http://localhost:8000/api/peliculas/tmdb/importar/157336"
```

**5. Verificar que se importó correctamente:**
```bash
curl -X GET "http://localhost:8000/api/peliculas/buscar/?titulo=Interstellar"
```

---

## 📝 Ejemplos de Uso con cURL

### Middleware de Logging
Cada petición registra:
- Método HTTP
- Ruta
- Código de estado
- Tiempo de procesamiento (disponible en header `X-Process-Time`)

### Manejo de Errores
Todos los errores incluyen mensajes descriptivos y estructura consistente:
```json
{
  "detail": "Descripción del error"
}
```

### CORS
La API permite solicitudes desde cualquier origen en desarrollo. Configurable en producción mediante `cors_origins` en el archivo de configuración.

---

## 🚀 Ejecutar la API

```bash
# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py

# O con uvicorn directamente
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`

---

## 📚 Documentación Interactiva

Visita `http://localhost:8000/docs` para explorar y probar todos los endpoints directamente desde el navegador con Swagger UI.
