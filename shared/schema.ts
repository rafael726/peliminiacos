import { z } from "zod";

// Película - basado en la API
export const peliculaSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  director: z.string(),
  genero: z.string(),
  duracion: z.number().min(1).max(600),
  año: z.number(),
  clasificacion: z.string(),
  sinopsis: z.string(),
  fecha_creacion: z.string(),
  image_url: z.string().nullable(),
});

export const insertPeliculaSchema = peliculaSchema.omit({
  id: true,
  fecha_creacion: true,
});

export type Pelicula = z.infer<typeof peliculaSchema>;
export type InsertPelicula = z.infer<typeof insertPeliculaSchema>;

// Usuario - basado en la API
export const usuarioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  correo: z.string().email(),
  fecha_registro: z.string(),
});

export const insertUsuarioSchema = usuarioSchema.omit({
  id: true,
  fecha_registro: true,
});

export type Usuario = z.infer<typeof usuarioSchema>;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;

// Favorito - basado en la API
export const favoritoSchema = z.object({
  id: z.number(),
  id_usuario: z.number(),
  id_pelicula: z.number(),
  fecha_marcado: z.string(),
});

export const insertFavoritoSchema = favoritoSchema.omit({
  id: true,
  fecha_marcado: true,
});

export type Favorito = z.infer<typeof favoritoSchema>;
export type InsertFavorito = z.infer<typeof insertFavoritoSchema>;

// Respuestas paginadas
export interface PaginatedResponse<T> {
  items: T[];
  total_records: number;
  current_pg: number;
  limit: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

// Estadísticas de usuario
export interface UserStats {
  usuario_id: number;
  nombre_usuario: string;
  total_favoritos: number;
  duracion_total_minutos: number;
  duracion_total_horas: number;
  generos_favoritos: Array<{ genero: string; cantidad: number }>;
  directores_favoritos: Array<{ director: string; cantidad: number }>;
  decada_favorita: { decada: string; cantidad: number };
  clasificacion_mas_vista: { clasificacion: string; cantidad: number };
  promedio_duracion: number;
}

// Favorito con detalles completos
export interface FavoritoDetallado extends Favorito {
  usuario?: Usuario;
  pelicula?: Pelicula;
}

// Verificación de favorito
export interface VerificacionFavorito {
  es_favorito: boolean;
  favorito_id?: number;
  fecha_marcado?: string;
}
