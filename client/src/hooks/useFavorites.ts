import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Pelicula } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useFavorites(userId: number) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const { data: userFavorites, isLoading } = useQuery<Pelicula[]>({
    queryKey: ["/api/usuarios", userId, "favoritos"],
    enabled: !!userId,
  });

  useEffect(() => {
    if (userFavorites) {
      setFavorites(new Set(userFavorites.map(movie => movie.id)));
    }
  }, [userFavorites]);

  const addFavoriteMutation = useMutation({
    mutationFn: async (movieId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/usuarios/${userId}/favoritos/${movieId}`
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/usuarios", userId, "favoritos"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (movieId: number) => {
      await apiRequest(
        "DELETE",
        `/api/usuarios/${userId}/favoritos/${movieId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/usuarios", userId, "favoritos"] });
    },
  });

  const toggleFavorite = async (movieId: number) => {
    const isFavorite = favorites.has(movieId);
    
    const previousFavorites = new Set(favorites);
    
    if (isFavorite) {
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
      
      try {
        await removeFavoriteMutation.mutateAsync(movieId);
      } catch (error) {
        setFavorites(previousFavorites);
        console.error("Error removing favorite:", error);
      }
    } else {
      setFavorites(prev => new Set(prev).add(movieId));
      
      try {
        await addFavoriteMutation.mutateAsync(movieId);
      } catch (error) {
        setFavorites(previousFavorites);
        console.error("Error adding favorite:", error);
      }
    }
  };

  return {
    favorites,
    userFavorites,
    isLoading,
    toggleFavorite,
    isToggling: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}
