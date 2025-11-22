import type { Express } from "express";
import { createServer, type Server } from "http";
// Note: we intentionally do NOT parse multipart bodies on the proxy.
// We'll forward the raw request stream to the backend so the backend
// can parse the multipart/form-data (avoiding multer here).

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";


export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/peliculas/populares/top", async (req, res) => {
    try {
      const limit = req.query.limit || 10;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/populares/top?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ error: "Failed to fetch popular movies" });
    }
  });

  app.get("/api/peliculas/recientes/nuevas", async (req, res) => {
    try {
      const limit = req.query.limit || 10;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/recientes/nuevas?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching recent movies:", error);
      res.status(500).json({ error: "Failed to fetch recent movies" });
    }
  });

  app.get("/api/peliculas/buscar", async (req, res) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (req.query.titulo) queryParams.append("titulo", req.query.titulo as string);
      if (req.query.director) queryParams.append("director", req.query.director as string);
      if (req.query.genero) queryParams.append("genero", req.query.genero as string);
      if (req.query.año) queryParams.append("año", req.query.año as string);
      if (req.query.año_min) queryParams.append("año_min", req.query.año_min as string);
      if (req.query.año_max) queryParams.append("año_max", req.query.año_max as string);
      if (req.query.clasificacion) queryParams.append("clasificacion", req.query.clasificacion as string);
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_BASE_URL}/api/peliculas/buscar?${queryString}` : `${API_BASE_URL}/api/peliculas/buscar`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ error: "Failed to search movies" });
    }
  });

  app.get("/api/peliculas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Movie not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  });

  app.get("/api/peliculas", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  });

  app.get("/api/usuarios", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/usuarios/:id/favoritos", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}/favoritos`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ error: "Failed to fetch user favorites" });
    }
  });

  app.post("/api/usuarios/:userId/favoritos/:peliculaId", async (req, res) => {
    try {
      const { userId, peliculaId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}/favoritos/${peliculaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User or movie not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/usuarios/:userId/favoritos/:peliculaId", async (req, res) => {
    try {
      const { userId, peliculaId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}/favoritos/${peliculaId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Favorite not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/favoritos/verificar/:userId/:peliculaId", async (req, res) => {
    try {
      const { userId, peliculaId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/verificar/${userId}/${peliculaId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error verifying favorite:", error);
      res.status(500).json({ error: "Failed to verify favorite" });
    }
  });

  app.post("/api/usuarios", async (req, res) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/usuarios/login", async (req, res) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return res.status(401).json({ detail: "Credenciales incorrectas" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.put("/api/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get("/api/usuarios/:id/estadisticas", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}/estadisticas`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user statistics" });
    }
  });

  app.post("/api/peliculas", async (req, res) => {
    try {
      console.log("Creating movie with data:", req.body);
      const response = await fetch(`${API_BASE_URL}/api/peliculas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      console.log("Backend response status:", response.status);
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          return res.status(response.status).json(errorData);
        } else {
          const textError = await response.text();
          console.error("Backend returned non-JSON:", textError.substring(0, 200));
          return res.status(response.status).json({ 
            detail: `Error del backend (${response.status})`,
            error: "Backend API error" 
          });
        }
      }
      
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating movie:", error);
      res.status(500).json({ 
        detail: error instanceof Error ? error.message : "Error al crear película",
        error: "Failed to create movie" 
      });
    }
  });

  app.put("/api/peliculas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Movie not found" });
        }
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error updating movie:", error);
      res.status(500).json({ error: "Failed to update movie" });
    }
  });

  app.post("/api/peliculas/:id/imagen", async (req, res) => {
    try {
      const { id } = req.params;

      // DEBUG: log incoming request headers for diagnosis
      console.debug('Incoming upload request headers:', req.headers);

      const contentType = req.headers['content-type'] as string | undefined;
      if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Expected multipart/form-data request' });
      }

      // Build headers to forward. Preserve Authorization if present.
      const forwardHeaders: Record<string, string> = {
        accept: 'application/json',
        'Content-Type': contentType,
      };

      const cl = req.headers['content-length'] as string | undefined;
      if (cl) forwardHeaders['content-length'] = cl;

      console.debug('Proxying upload with headers:', forwardHeaders);

      // Forward the raw request stream to the backend so it can parse the multipart data itself
      // Node's fetch requires the `duplex` option when sending a streaming body.
      // Set it to 'half' to allow streaming the request to the backend.
      const fetchOptions: any = {
        method: 'POST',
        headers: forwardHeaders,
        // Forward the raw request stream directly. Use `any` to satisfy TS types for fetch body.
        body: req as any,
        duplex: 'half',
      };

      const response = await fetch(`${API_BASE_URL}/api/peliculas/${id}/imagen`, fetchOptions);

      if (!response.ok) {
        const contentTypeResp = response.headers.get('content-type');
        let errorData;
        if (contentTypeResp && contentTypeResp.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { detail: text || 'Failed to upload image' };
        }

        console.error('Backend error:', errorData);
        return res.status(response.status).json(errorData);
      }

      // Stream response back to client
      const respBody = await response.json();
      console.log('Upload success:', respBody);
      res.json(respBody);
    } catch (err) {
      console.error('Error uploading image:', err);
      res.status(500).json({ error: 'Failed to upload image', detail: err instanceof Error ? err.message : String(err) });
    }
  });

  app.delete("/api/peliculas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Movie not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting movie:", error);
      res.status(500).json({ error: "Failed to delete movie" });
    }
  });

  app.get("/api/peliculas/clasificacion/:clasificacion", async (req, res) => {
    try {
      const { clasificacion } = req.params;
      const limit = req.query.limit || 100;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/clasificacion/${clasificacion}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movies by classification:", error);
      res.status(500).json({ error: "Failed to fetch movies by classification" });
    }
  });

  app.get("/api/favoritos", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favoritos", async (req, res) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favoritos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }
      
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating favorite:", error);
      res.status(500).json({ error: "Failed to create favorite" });
    }
  });

  app.get("/api/favoritos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Favorite not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching favorite:", error);
      res.status(500).json({ error: "Failed to fetch favorite" });
    }
  });

  app.delete("/api/favoritos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Favorite not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting favorite:", error);
      res.status(500).json({ error: "Failed to delete favorite" });
    }
  });

  app.get("/api/favoritos/usuario/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/usuario/${userId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ error: "Failed to fetch user favorites" });
    }
  });

  app.get("/api/favoritos/pelicula/:peliculaId", async (req, res) => {
    try {
      const { peliculaId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/pelicula/${peliculaId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie favorites:", error);
      res.status(500).json({ error: "Failed to fetch movie favorites" });
    }
  });

  app.get("/api/favoritos/estadisticas/generales", async (req, res) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favoritos/estadisticas/generales`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching favorites statistics:", error);
      res.status(500).json({ error: "Failed to fetch favorites statistics" });
    }
  });

  app.delete("/api/favoritos/usuario/:userId/todos", async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/usuario/${userId}/todos`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting all favorites:", error);
      res.status(500).json({ error: "Failed to delete all favorites" });
    }
  });

  app.get("/api/favoritos/recomendaciones/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit || 5;
      const response = await fetch(`${API_BASE_URL}/api/favoritos/recomendaciones/${userId}?limit=${limit}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.get("/api/peliculas/tmdb/populares", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const importar = req.query.importar === "true";
      const response = await fetch(`${API_BASE_URL}/api/peliculas/tmdb/populares?page=${page}&importar=${importar}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching TMDB popular movies:", error);
      res.status(500).json({ error: "Failed to fetch TMDB popular movies" });
    }
  });

  app.get("/api/peliculas/tmdb/buscar", async (req, res) => {
    try {
      const query = req.query.query as string;
      const page = req.query.page || 1;
      const importar = req.query.importar === "true";
      
      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/peliculas/tmdb/buscar?query=${encodeURIComponent(query)}&page=${page}&importar=${importar}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error searching TMDB movies:", error);
      res.status(500).json({ error: "Failed to search TMDB movies" });
    }
  });

  app.post("/api/peliculas/tmdb/importar/:tmdbId", async (req, res) => {
    try {
      const { tmdbId } = req.params;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/tmdb/importar/${tmdbId}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }
      
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      console.error("Error importing TMDB movie:", error);
      res.status(500).json({ error: "Failed to import TMDB movie" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
