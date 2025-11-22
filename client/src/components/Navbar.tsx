import { Link, useLocation } from "wouter";
import { Search, Film, Heart, User, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface NavbarProps {
  onSearch?: (query: string) => void;
  currentUser?: { id: number; nombre: string } | null;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      onSearch?.(searchQuery.trim());
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all cursor-pointer">
              <Film className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl tracking-wider hidden sm:block">
                PELIMANIATICOS
              </span>
            </div>
          </Link>

          <form 
            onSubmit={handleSearch} 
            className="flex-1 max-w-xl hidden md:block"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-card-border"
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/peliculas/crear" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Película
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tmdb/importar" className="cursor-pointer">
                    <Download className="w-4 h-4 mr-2" />
                    Importar desde TMDB
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/favoritos" data-testid="link-favorites">
              <Button 
                variant="ghost" 
                size="icon"
                className={location === "/favoritos" ? "bg-accent" : ""}
              >
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            
            <Link href="/usuarios" data-testid="link-users">
              <Button 
                variant="ghost" 
                size="icon"
                className={location === "/usuarios" ? "bg-accent" : ""}
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <form 
          onSubmit={handleSearch} 
          className="pb-3 md:hidden"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar películas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-card-border"
              data-testid="input-search-mobile"
            />
          </div>
        </form>
      </div>
    </nav>
  );
}
