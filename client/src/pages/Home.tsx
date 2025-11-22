import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pelicula, PaginatedResponse } from "@shared/schema";
import { HeroSection } from "@/components/HeroSection";
import { MovieSection } from "@/components/MovieSection";
import { Navbar } from "@/components/Navbar";
import { useFavorites } from "@/hooks/useFavorites";

export default function Home() {
  const [currentUserId] = useState<number>(1);
  const { favorites, toggleFavorite } = useFavorites(currentUserId);

  const { data: popularMovies, isLoading: isLoadingPopular } = useQuery<Pelicula[]>({
    queryKey: ["/api/peliculas/populares/top", { limit: 10 }],
  });

  const { data: recentMovies, isLoading: isLoadingRecent } = useQuery<Pelicula[]>({
    queryKey: ["/api/peliculas/recientes/nuevas", { limit: 10 }],
  });

  const { data: allMoviesData, isLoading: isLoadingAll } = useQuery<PaginatedResponse<Pelicula>>({
    queryKey: ["/api/peliculas", { page: 1, limit: 20 }],
  });

  const allMovies = allMoviesData?.items;
  const heroMovie = popularMovies?.[0] || recentMovies?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <HeroSection
          movie={heroMovie}
          onToggleFavorite={toggleFavorite}
          isFavorite={heroMovie ? favorites.has(heroMovie.id) : false}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
          <MovieSection
            title="Películas Populares"
            movies={popularMovies?.slice(1, 11) || []}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewAllLink="/catalogo?filter=popular"
            isLoading={isLoadingPopular}
          />

          <MovieSection
            title="Recién Agregadas"
            movies={recentMovies || []}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewAllLink="/catalogo?filter=recent"
            isLoading={isLoadingRecent}
          />

          <MovieSection
            title="Explorar Catálogo"
            movies={allMovies || []}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewAllLink="/catalogo"
            isLoading={isLoadingAll}
          />
        </div>
      </div>
    </div>
  );
}
