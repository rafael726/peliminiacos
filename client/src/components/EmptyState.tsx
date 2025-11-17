import { Button } from "@/components/ui/button";
import { Film, Heart, Search } from "lucide-react";
import emptyFavoritesImage from "@assets/generated_images/Empty_favorites_illustration_ef4651d5.png";

interface EmptyStateProps {
  type: "favorites" | "search" | "movies";
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({ type, onAction, actionLabel }: EmptyStateProps) {
  const config = {
    favorites: {
      icon: Heart,
      image: emptyFavoritesImage,
      title: "No tienes favoritos aún",
      description: "Explora nuestro catálogo y marca tus películas favoritas para verlas aquí",
      action: actionLabel || "Explorar Películas"
    },
    search: {
      icon: Search,
      title: "No se encontraron resultados",
      description: "Intenta ajustar tus filtros o términos de búsqueda",
      action: actionLabel || "Limpiar Búsqueda"
    },
    movies: {
      icon: Film,
      title: "No hay películas disponibles",
      description: "No se encontraron películas en este momento",
      action: actionLabel || "Recargar"
    }
  };

  const { icon: Icon, image, title, description, action } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" data-testid={`empty-state-${type}`}>
      {image ? (
        <img 
          src={image} 
          alt={title}
          className="w-64 h-48 object-contain mb-6 opacity-80"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          data-testid="button-empty-action"
        >
          {action}
        </Button>
      )}
    </div>
  );
}
