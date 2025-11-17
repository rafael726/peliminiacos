import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Usuario, PaginatedResponse } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Users() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: usersData, isLoading } = useQuery<PaginatedResponse<Usuario>>({
    queryKey: ["/api/usuarios", { page, limit }],
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              Usuarios
            </h1>
            <p className="text-muted-foreground">
              Comunidad de amantes del cine en PeliManiaticos
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : usersData && usersData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersData.items.map((user) => (
                  <Card 
                    key={user.id} 
                    className="p-6 bg-card border-card-border hover-elevate transition-all"
                    data-testid={`card-user-${user.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                          {getInitials(user.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {user.nombre}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{user.correo}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>Miembro desde {formatDate(user.fecha_registro)}</span>
                        </div>

                        <Link href={`/usuario/${user.id}/favoritos`}>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            data-testid={`button-user-favorites-${user.id}`}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Ver Favoritos
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {usersData.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!usersData.has_prev}
                    data-testid="button-prev-users"
                  >
                    Anterior
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Página {usersData.current_pg} de {usersData.pages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!usersData.has_next}
                    data-testid="button-next-users"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-12 text-center bg-card border-card-border">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay usuarios registrados</h3>
              <p className="text-muted-foreground">
                Aún no hay usuarios en la plataforma
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
