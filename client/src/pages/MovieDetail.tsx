import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Pelicula } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Calendar, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import placeholderImage from "@assets/generated_images/Movie_poster_placeholder_dd60c1d0.png";
import heroImage from "@assets/generated_images/Sci-fi_hero_backdrop_e6d7dfe2.png";

export default function MovieDetail() {
  const params = useParams();
  const movieId = Number(params.id);
  const [currentUserId] = useState<number>(1);
  const { favorites, toggleFavorite } = useFavorites(currentUserId);

  const { data: movie, isLoading } = useQuery<Pelicula>({
    queryKey: ["/api/peliculas", movieId],
    enabled: !!movieId,
  });

  const { data: relatedMovies } = useQuery<Pelicula[]>({
    queryKey: ["/api/peliculas/populares/top", { limit: 6 }],
  });

  const isFavorite = movie ? favorites.has(movie.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="h-[60vh] bg-card animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-card rounded animate-pulse" />
              <div className="h-6 w-full bg-card rounded animate-pulse" />
              <div className="h-6 w-5/6 bg-card rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Película no encontrada</h1>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const genres = movie.genero.split(',').map(g => g.trim());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={movie.image_url || heroImage}
              alt={movie.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="mt-6 backdrop-blur-md bg-black/20 hover:bg-black/40 text-white"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden border-card-border">
                <img
                  src={movie.image_url || placeholderImage}
                  alt={movie.titulo}
                  className="w-full aspect-[2/3] object-cover"
                />
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4">
                  {movie.titulo}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((genre, idx) => (
                    <Badge 
                      key={idx}
                      className="text-sm uppercase tracking-wide"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duracion} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.año}</span>
                  </div>
                  <Badge variant="outline">
                    {movie.clasificacion}
                  </Badge>
                </div>

                <div className="flex gap-3 mb-8">
                  <Button 
                    size="lg"
                    onClick={() => movie && toggleFavorite(movie.id)}
                    variant={isFavorite ? "default" : "outline"}
                    data-testid="button-toggle-favorite"
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
                  </Button>
                </div>
              </div>

              <Card className="p-6 bg-card border-card-border">
                <h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.sinopsis}
                </p>
              </Card>

              <Card className="p-6 bg-card border-card-border">
                <h2 className="text-xl font-semibold mb-4">Información</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Director:</span>
                    <p className="font-medium">{movie.director}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Año de Estreno:</span>
                    <p className="font-medium">{movie.año}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duración:</span>
                    <p className="font-medium">{movie.duracion} minutos ({Math.floor(movie.duracion / 60)}h {movie.duracion % 60}m)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Clasificación:</span>
                    <p className="font-medium">{movie.clasificacion}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Géneros:</span>
                    <p className="font-medium">{movie.genero}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {relatedMovies && relatedMovies.length > 0 && (
            <div className="mt-16 mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Películas Relacionadas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {relatedMovies.filter(m => m.id !== movieId).slice(0, 5).map((relatedMovie) => (
                  <Link key={relatedMovie.id} href={`/pelicula/${relatedMovie.id}`}>
                    <Card className="group overflow-hidden rounded-lg border-card-border hover:scale-105 transition-transform cursor-pointer">
                      <div className="aspect-[2/3]">
                        <img
                          src={relatedMovie.image_url || placeholderImage}
                          alt={relatedMovie.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2">{relatedMovie.titulo}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{relatedMovie.año}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
