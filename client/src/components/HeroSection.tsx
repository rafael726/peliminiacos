import { Pelicula } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Clock, Calendar } from "lucide-react";
import { Link } from "wouter";
import heroImage1 from "@assets/generated_images/Sci-fi_hero_backdrop_e6d7dfe2.png";
import heroImage2 from "@assets/generated_images/Action_hero_backdrop_f76816ad.png";
import heroImage3 from "@assets/generated_images/Fantasy_hero_backdrop_a75c5185.png";

interface HeroSectionProps {
  movie?: Pelicula;
  onToggleFavorite?: (movieId: number) => void;
  isFavorite?: boolean;
}

const heroImages = [heroImage1, heroImage2, heroImage3];

export function HeroSection({ movie, onToggleFavorite, isFavorite }: HeroSectionProps) {
  const randomHeroImage = heroImages[Math.floor(Math.random() * heroImages.length)];
  
  if (!movie) {
    return (
      <div className="relative h-[85vh] w-full overflow-hidden bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0">
          <img
            src={randomHeroImage}
            alt="Hero backdrop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
          <div className="max-w-2xl space-y-6">
            <div className="h-12 w-3/4 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-6 w-full bg-white/10 rounded-lg animate-pulse" />
            <div className="h-6 w-5/6 bg-white/10 rounded-lg animate-pulse" />
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={movie.image_url || randomHeroImage}
          alt={movie.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl space-y-6" data-testid="hero-movie">
          <div className="flex flex-wrap gap-2">
            {movie.genero.split(',').slice(0, 3).map((genre, idx) => (
              <Badge 
                key={idx} 
                className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border-white/30"
              >
                {genre.trim()}
              </Badge>
            ))}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-tight tracking-wide drop-shadow-2xl">
            {movie.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">{movie.duracion} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">{movie.año}</span>
            </div>
            <Badge variant="outline" className="border-white/50 text-white">
              {movie.clasificacion}
            </Badge>
          </div>

          <p className="text-white/90 text-base sm:text-lg leading-relaxed line-clamp-3">
            {movie.sinopsis}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/pelicula/${movie.id}`}>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 backdrop-blur-md"
                data-testid="button-hero-play"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Ver Detalles
              </Button>
            </Link>
            
            {onToggleFavorite && (
              <Button 
                size="lg"
                variant="outline"
                className="border-white/50 text-white backdrop-blur-md bg-white/10 hover:bg-white/20"
                onClick={() => onToggleFavorite(movie.id)}
                data-testid="button-hero-favorite"
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
              </Button>
            )}
          </div>

          <div className="text-white/70 text-sm">
            <span className="font-medium text-white">Director:</span> {movie.director}
          </div>
        </div>
      </div>
    </div>
  );
}
