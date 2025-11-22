import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { UserStats } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Clock, Film, Calendar, Star, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function UserStatistics() {
  const { id } = useParams();
  
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: [`/api/usuarios/${id}/estadisticas`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-card rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-card rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Usuario no encontrado</h3>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                Estadísticas de {stats.nombre_usuario}
              </h1>
              <Link href={`/usuarios/${id}/favoritos`}>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Ver Favoritos
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground">
              Análisis detallado de preferencias cinematográficas
            </p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-primary" />
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {stats.total_favoritos}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">Películas Favoritas</h3>
              <p className="text-sm text-muted-foreground">En tu colección</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-blue-500" />
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {Math.round(stats.duracion_total_horas)}h
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">Horas de Cine</h3>
              <p className="text-sm text-muted-foreground">{stats.duracion_total_minutos} minutos</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <Film className="w-8 h-8 text-purple-500" />
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {Math.round(stats.promedio_duracion)} min
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">Duración Promedio</h3>
              <p className="text-sm text-muted-foreground">Por película</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-orange-500" />
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {stats.decada_favorita.decada}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">Década Favorita</h3>
              <p className="text-sm text-muted-foreground">{stats.decada_favorita.cantidad} películas</p>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Géneros Favoritos */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Géneros Favoritos
              </h2>
              <div className="space-y-3">
                {stats.generos_favoritos.map((genero, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-muted-foreground/50">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{genero.genero}</span>
                    </div>
                    <Badge>{genero.cantidad} películas</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Directores Favoritos */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Directores Favoritos
              </h2>
              <div className="space-y-3">
                {stats.directores_favoritos.map((director, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-muted-foreground/50">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{director.director}</span>
                    </div>
                    <Badge>{director.cantidad} películas</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Clasificación más vista */}
          <Card className="p-6 mt-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Film className="w-5 h-5 text-green-500" />
                  Clasificación más vista
                </h2>
                <p className="text-muted-foreground">
                  Tu clasificación de edad preferida
                </p>
              </div>
              <div className="text-right">
                <Badge className="text-2xl px-6 py-3 bg-green-500/20 text-green-700 dark:text-green-300">
                  {stats.clasificacion_mas_vista.clasificacion}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.clasificacion_mas_vista.cantidad} películas
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
