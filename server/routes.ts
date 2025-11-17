import type { Express } from "express";
import { createServer, type Server } from "http";

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
      const skip = req.query.skip || 0;
      const limit = req.query.limit || 100;
      const response = await fetch(`${API_BASE_URL}/api/peliculas/?skip=${skip}&limit=${limit}`);
      
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

  const httpServer = createServer(app);

  return httpServer;
}
