import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pelicula } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Film, Search, Download, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import placeholderImage from "@assets/generated_images/Movie_poster_placeholder_dd60c1d0.png";

interface TMDBMovie extends Pelicula {
  tmdb_id?: number;
}

export default function TMDBImport() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"popular" | "search">("popular");
  const [importingIds, setImportingIds] = useState<Set<number>>(new Set());
  const [popularPage, setPopularPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);

  const { data: popularMovies, isLoading: loadingPopular } = useQuery<TMDBMovie[]>({
    queryKey: ["/api/peliculas/tmdb/populares", { page: popularPage, importar: false }],
    enabled: searchMode === "popular",
  });

  const { data: searchResults, isLoading: loadingSearch } = useQuery<TMDBMovie[]>({
    queryKey: ["/api/peliculas/tmdb/buscar", { query: searchQuery, page: searchPage, importar: false }],
    enabled: searchMode === "search" && searchQuery.length > 0,
  });

  const handleImport = async (tmdbId: number, titulo: string) => {
    setImportingIds(prev => new Set(prev).add(tmdbId));

    try {
      const response = await fetch(`/api/peliculas/tmdb/importar/${tmdbId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al importar película");
      }

      toast({
        title: "¡Película importada!",
        description: `"${titulo}" se ha agregado correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo importar la película",
        variant: "destructive",
      });
    } finally {
      setImportingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tmdbId);
        return newSet;
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchMode("search");
      setSearchPage(1);
    }
  };

  const currentPage = searchMode === "search" ? searchPage : popularPage;
  const setCurrentPage = searchMode === "search" ? setSearchPage : setPopularPage;

  const movies = searchMode === "search" ? searchResults : popularMovies;
  const isLoading = searchMode === "search" ? loadingSearch : loadingPopular;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
              <Download className="w-8 h-8 text-primary" />
              Importar desde TMDB
            </h1>
            <p className="text-muted-foreground">
              Busca e importa películas desde The Movie Database
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Buscar películas en TMDB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                  data-testid="input-search-tmdb"
                />
                <Button type="submit" className="h-12" data-testid="button-search-tmdb">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </form>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchMode("popular");
                  setSearchQuery("");
                  setPopularPage(1);
                }}
                className="h-12"
                data-testid="button-popular-tmdb"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Populares
              </Button>
            </div>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : movies && movies.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {searchMode === "search" ? "Resultados de búsqueda" : "Películas populares"}
                </h2>
                <Badge variant="secondary">{movies.length} películas</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <Card
                    key={movie.id || movie.tmdb_id}
                    className="overflow-hidden hover-elevate transition-all group"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                      <img
                        src={'https://image.tmdb.org/t/p/w500/'+ movie.image_url || placeholderImage}
                        alt={movie.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = placeholderImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <p className="text-white text-sm line-clamp-3 mb-2">
                          {movie.sinopsis}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {movie.titulo}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{movie.año}</span>
                        <span>{movie.duracion} min</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleImport(movie.id, movie.titulo)}
                        disabled={importingIds.has(movie.id)}
                        data-testid={`button-import-${movie.id}`}
                      >
                        {importingIds.has(movie.id) ? (
                          <>Importando...</>
                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-2" />
                            Importar
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!movies || movies.length === 0 || isLoading}
                  data-testid="button-next-page"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron películas</h3>
              <p className="text-muted-foreground">
                {searchMode === "search" 
                  ? "Intenta con otros términos de búsqueda"
                  : "No hay películas disponibles en este momento"}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
