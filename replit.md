# PeliManiaticos - Plataforma de Streaming de Películas

## Descripción
PeliManiaticos es una aplicación web moderna de streaming de películas con una interfaz cinematográfica tipo Netflix/Disney+. La aplicación consume una API REST externa para gestionar películas, usuarios y favoritos.

## Arquitectura

### Frontend
- **Framework**: React + TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Theme**: Dark mode by default con paleta cinematográfica
- **Tipografía**: Inter (sans-serif) + Bebas Neue (display)

### Backend
- **Framework**: Express.js
- **Función**: Proxy hacia API externa en localhost:8000
- **Rutas**: Todas las rutas comienzan con `/api`

### API Externa
- **Base URL**: http://localhost:8000
- **Documentación**: Ver `attached_assets/ENDPOINTS_1763387837289.md`

## Características Implementadas

### MVP Features
1. **Catálogo de Películas**
   - Grid responsive con cards cinematográficas
   - Hover effects con información adicional
   - Paginación

2. **Página de Detalles**
   - Hero section con backdrop image
   - Información completa de la película
   - Películas relacionadas

3. **Sistema de Búsqueda y Filtros**
   - Búsqueda por título
   - Filtros por director, género, año, clasificación
   - Resultados en tiempo real

4. **Gestión de Usuarios**
   - Lista de usuarios con avatares
   - Ver favoritos de cada usuario

5. **Sistema de Favoritos**
   - Agregar/quitar películas de favoritos
   - Página de favoritos personalizada
   - Estadísticas (total películas, tiempo total)

6. **Secciones Destacadas**
   - Películas Populares (más favoritas)
   - Recién Agregadas
   - Hero Section dinámico

7. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: sm, md, lg, xl
   - Navigation adaptativa

## Estructura de Archivos

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (Shadcn components)
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MovieSection.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── MovieDetail.tsx
│   │   │   ├── Catalog.tsx
│   │   │   ├── Favorites.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Search.tsx
│   │   ├── hooks/
│   │   │   └── useFavorites.ts
│   │   └── App.tsx
├── server/
│   ├── routes.ts (Proxy to external API)
│   └── index.ts
├── shared/
│   └── schema.ts (TypeScript types)
└── attached_assets/
    └── generated_images/ (Hero backdrops & placeholders)
```

## Rutas de la Aplicación

- `/` - Home (Hero + Populares + Recientes)
- `/pelicula/:id` - Detalles de película
- `/catalogo` - Catálogo completo con filtros
- `/favoritos` - Mis favoritos
- `/usuarios` - Lista de usuarios
- `/buscar?q=query` - Resultados de búsqueda

## API Endpoints Implementados

### Películas
- `GET /api/peliculas` - Lista paginada
- `GET /api/peliculas/:id` - Detalles de película
- `GET /api/peliculas/populares/top` - Películas más populares
- `GET /api/peliculas/recientes/nuevas` - Recién agregadas
- `GET /api/peliculas/buscar` - Búsqueda con filtros

### Usuarios
- `GET /api/usuarios` - Lista paginada de usuarios
- `GET /api/usuarios/:id` - Detalles de usuario
- `GET /api/usuarios/:id/favoritos` - Favoritos del usuario
- `POST /api/usuarios/:userId/favoritos/:peliculaId` - Agregar favorito
- `DELETE /api/usuarios/:userId/favoritos/:peliculaId` - Quitar favorito

### Favoritos
- `GET /api/favoritos/verificar/:userId/:peliculaId` - Verificar si es favorito

## Configuración de Colores

### Dark Mode (Default)
- **Background**: Deep dark blue (hsl(222 47% 5%))
- **Primary**: Purple (hsl(271 91% 65%))
- **Card**: Slightly lighter dark (hsl(222 47% 7%))
- **Accent**: Purple tint (hsl(271 15% 15%))

### Light Mode
- **Background**: White
- **Primary**: Purple (hsl(271 91% 65%))
- **Card**: Light gray
- **Accent**: Light purple tint

## Estado Actual del Usuario

La aplicación usa un usuario hardcodeado con `id: 1` para todas las operaciones de favoritos. En producción, esto debería reemplazarse con un sistema de autenticación real.

## Dependencias Clave

- `@tanstack/react-query` - Data fetching y cache
- `wouter` - Routing ligero
- `lucide-react` - Iconos
- `tailwindcss` - Styling
- `shadcn/ui` - Component library

## Variables de Entorno

- `API_BASE_URL` - URL de la API externa (default: http://localhost:8000)

## ⚠️ IMPORTANTE: Requisitos para Ejecutar la Aplicación

**Esta aplicación requiere que la API REST externa esté corriendo en `http://localhost:8000`**

La aplicación fue diseñada específicamente para consumir una API REST existente (documentada en `attached_assets/ENDPOINTS_1763387837289.md`). El backend Express actúa únicamente como proxy hacia esa API.

### Para ejecutar la aplicación completamente:

1. **Iniciar la API externa**: Asegúrate de que la API de películas esté corriendo en `http://localhost:8000`
2. **Iniciar esta aplicación**: El workflow "Start application" ya está configurado y corriendo en puerto 5000
3. **Acceder**: Navega a la URL de tu Repl para ver la aplicación

### Sin la API externa:

- La aplicación frontend se cargará correctamente
- Verás la estructura visual y el diseño
- Los datos no se cargarán (estados de loading permanentes)
- Las operaciones de favoritos no funcionarán

### Estado Actual:

✅ Frontend completamente implementado y funcional
✅ Backend proxy correctamente configurado  
✅ Todas las rutas y componentes listos
✅ Sistema de favoritos con mutaciones implementadas
✅ Diseño cinematográfico responsive completo
⚠️ Esperando API externa en localhost:8000 para funcionalidad completa

## Notas de Desarrollo

1. **No hay backend propio**: El servidor Express solo actúa como proxy
2. **Imágenes generadas**: Las imágenes hero y placeholders fueron generadas con IA
3. **Dark mode first**: El diseño está optimizado para modo oscuro
4. **Mobile responsive**: Todos los componentes son responsive
5. **Hover effects**: Cards tienen animaciones sutiles al hacer hover
6. **Loading states**: Todos los queries muestran estados de carga

## Próximos Pasos (Post-MVP)

1. Sistema de autenticación real
2. Reproductor de video integrado
3. Estadísticas detalladas del usuario
4. Sistema de recomendaciones basado en ML
5. Comentarios y ratings de películas
6. Listas personalizadas de películas
7. Compartir favoritos en redes sociales
