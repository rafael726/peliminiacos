import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Pelicula } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { SearchFilters, SearchFiltersState } from "@/components/SearchFilters";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function Catalog() {
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  const [currentUserId] = useState<number>(1);
  const { favorites, toggleFavorite } = useFavorites(currentUserId);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFiltersState>({});
  const limit = 20;

  const params = new URLSearchParams(searchParams);
  const filterType = params.get("filter");

  let queryKey: any[];

  if (filterType === "popular") {
    queryKey = ["/api/peliculas/populares/top", { limit: 50 }];
  } else if (filterType === "recent") {
    queryKey = ["/api/peliculas/recientes/nuevas", { limit: 50 }];
  } else if (Object.keys(filters).length > 0) {
    queryKey = ["/api/peliculas/buscar", filters];
  } else {
    queryKey = ["/api/peliculas", { skip: (page - 1) * limit, limit }];
  }

  const { data: moviesData, isLoading } = useQuery<Pelicula[]>({
    queryKey,
  });

  const handleApplyFilters = () => {
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
    setLocation("/catalogo");
  };

  const movies = moviesData || [];
  const totalPages = Math.ceil((movies.length || 0) / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  const paginatedMovies = filterType ? movies : movies.slice(0, limit);

  const getPageTitle = () => {
    if (filterType === "popular") return "Películas Populares";
    if (filterType === "recent") return "Recién Agregadas";
    if (Object.keys(filters).length > 0) return "Resultados de Búsqueda";
    return "Catálogo Completo";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">{getPageTitle()}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>

            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-card rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : paginatedMovies.length === 0 ? (
                <EmptyState
                  type="search"
                  onAction={handleResetFilters}
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {paginatedMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFavorite={favorites.has(movie.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!hasPrev}
                        data-testid="button-prev-page"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                      </Button>
                      
                      <div className="flex items-center gap-2 px-4">
                        <span className="text-sm text-muted-foreground">
                          Página {page} de {totalPages}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={!hasNext}
                        data-testid="button-next-page"
                      >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
