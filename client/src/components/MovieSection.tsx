import { Pelicula } from "@shared/schema";
import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface MovieSectionProps {
  title: string;
  movies: Pelicula[];
  favorites?: Set<number>;
  onToggleFavorite?: (movieId: number) => void;
  viewAllLink?: string;
  isLoading?: boolean;
}

export function MovieSection({ 
  title, 
  movies, 
  favorites = new Set(),
  onToggleFavorite,
  viewAllLink,
  isLoading = false
}: MovieSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-card rounded animate-pulse" />
          <div className="h-10 w-24 bg-card rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6" data-testid={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <Button variant="ghost" className="gap-2" data-testid="button-view-all">
              Ver Todas
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.has(movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
