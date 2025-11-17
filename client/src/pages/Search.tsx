import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Pelicula } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function Search() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const query = params.get("q") || "";
  
  const [currentUserId] = useState<number>(1);
  const { favorites, toggleFavorite } = useFavorites(currentUserId);

  const { data: searchResults, isLoading } = useQuery<Pelicula[]>({
    queryKey: ["/api/peliculas/buscar", { titulo: query }],
    enabled: !!query,
  });

  const handleClearSearch = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Resultados de Búsqueda
            </h1>
            
            {query && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  "{query}"
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-5 w-5"
                    onClick={handleClearSearch}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
                {searchResults && (
                  <span className="text-muted-foreground">
                    {searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"}
                  </span>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={favorites.has(movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              onAction={handleClearSearch}
              actionLabel="Volver al Inicio"
            />
          )}
        </div>
      </div>
    </div>
  );
}
