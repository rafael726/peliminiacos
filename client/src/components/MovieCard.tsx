import { Pelicula } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Info, Clock } from "lucide-react";
import { Link } from "wouter";
import placeholderImage from "@assets/generated_images/Movie_poster_placeholder_dd60c1d0.png";

interface MovieCardProps {
  movie: Pelicula;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  showActions?: boolean;
}

export function MovieCard({ 
  movie, 
  isFavorite = false, 
  onToggleFavorite,
  showActions = true 
}: MovieCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden rounded-lg border-card-border bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl"
      data-testid={`card-movie-${movie.id}`}
    >
      <Link href={`/pelicula/${movie.id}`}>
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={movie.image_url || placeholderImage}
            alt={movie.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="font-semibold text-white text-lg line-clamp-2">
            {movie.titulo}
          </h3>
          
          <div className="flex flex-wrap gap-1">
            {movie.genero.split(',').slice(0, 2).map((genre, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs bg-white/20 text-white border-white/30"
              >
                {genre.trim()}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {movie.duracion} min
            </span>
            <span>{movie.año}</span>
            <Badge variant="outline" className="text-xs border-white/40 text-white">
              {movie.clasificacion}
            </Badge>
          </div>

          {showActions && (
            <div className="flex gap-2 pt-2">
              <Link href={`/pelicula/${movie.id}`} className="flex-1">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="w-full bg-white/90 text-black hover:bg-white"
                  data-testid={`button-info-${movie.id}`}
                >
                  <Info className="w-4 h-4 mr-1" />
                  Info
                </Button>
              </Link>
              
              {onToggleFavorite && (
                <Button 
                  size="sm"
                  variant={isFavorite ? "default" : "secondary"}
                  className={isFavorite ? "bg-primary" : "bg-white/90 text-black hover:bg-white"}
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(movie.id);
                  }}
                  data-testid={`button-favorite-${movie.id}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
