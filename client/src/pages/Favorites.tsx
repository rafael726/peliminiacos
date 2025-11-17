import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Film } from "lucide-react";
import { useLocation } from "wouter";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const [currentUserId] = useState<number>(1);
  const { favorites, userFavorites, isLoading, toggleFavorite } = useFavorites(currentUserId);

  const totalDuration = userFavorites?.reduce((acc, movie) => acc + movie.duracion, 0) || 0;
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary fill-current" />
              Mis Favoritos
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu colección personal de películas favoritas
            </p>
          </div>

          {isLoading ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ) : userFavorites && userFavorites.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 bg-card border-card-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Film className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Películas</p>
                      <p className="text-2xl font-bold" data-testid="text-total-favorites">
                        {userFavorites.length}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-card-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo Total</p>
                      <p className="text-2xl font-bold">
                        {totalHours}h {totalMinutes}m
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-card-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Heart className="w-6 h-6 text-primary fill-current" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Promedio Duración</p>
                      <p className="text-2xl font-bold">
                        {Math.round(totalDuration / userFavorites.length)} min
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {userFavorites.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={favorites.has(movie.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              type="favorites"
              onAction={() => setLocation("/")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
