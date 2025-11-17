import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

export interface SearchFiltersState {
  titulo?: string;
  director?: string;
  genero?: string;
  año?: number;
  año_min?: number;
  año_max?: number;
  clasificacion?: string;
}

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFiltersChange: (filters: SearchFiltersState) => void;
  onApply: () => void;
  onReset: () => void;
}

const CLASIFICACIONES = ["G", "PG", "PG-13", "R", "NC-17", "NR", "ATP", "+13", "+16", "+18"];
const GENEROS_COMUNES = [
  "Acción",
  "Aventura",
  "Ciencia Ficción",
  "Comedia",
  "Drama",
  "Terror",
  "Thriller",
  "Romance",
  "Animación",
  "Fantasía",
  "Documental",
  "Crimen"
];

export function SearchFilters({ filters, onFiltersChange, onApply, onReset }: SearchFiltersProps) {
  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState<[number, number]>([
    filters.año_min || 1888,
    filters.año_max || currentYear
  ]);

  const handleYearRangeChange = (values: number[]) => {
    setYearRange([values[0], values[1]]);
    onFiltersChange({
      ...filters,
      año_min: values[0],
      año_max: values[1]
    });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof SearchFiltersState] !== undefined
  );

  return (
    <Card className="p-6 space-y-6 bg-card border-card-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros de Búsqueda</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            data-testid="button-reset-filters"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            placeholder="Buscar por título..."
            value={filters.titulo || ""}
            onChange={(e) => onFiltersChange({ ...filters, titulo: e.target.value })}
            data-testid="input-filter-titulo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="director">Director</Label>
          <Input
            id="director"
            placeholder="Buscar por director..."
            value={filters.director || ""}
            onChange={(e) => onFiltersChange({ ...filters, director: e.target.value })}
            data-testid="input-filter-director"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genero">Género</Label>
          <Select 
            value={filters.genero || ""} 
            onValueChange={(value) => onFiltersChange({ ...filters, genero: value || undefined })}
          >
            <SelectTrigger id="genero" data-testid="select-filter-genero">
              <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los géneros</SelectItem>
              {GENEROS_COMUNES.map((genero) => (
                <SelectItem key={genero} value={genero}>
                  {genero}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clasificacion">Clasificación</Label>
          <Select 
            value={filters.clasificacion || ""} 
            onValueChange={(value) => onFiltersChange({ ...filters, clasificacion: value || undefined })}
          >
            <SelectTrigger id="clasificacion" data-testid="select-filter-clasificacion">
              <SelectValue placeholder="Seleccionar clasificación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las clasificaciones</SelectItem>
              {CLASIFICACIONES.map((clasificacion) => (
                <SelectItem key={clasificacion} value={clasificacion}>
                  {clasificacion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Rango de Años</Label>
          <div className="px-2">
            <Slider
              min={1888}
              max={currentYear}
              step={1}
              value={yearRange}
              onValueChange={handleYearRangeChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={onApply} 
        className="w-full"
        data-testid="button-apply-filters"
      >
        Aplicar Filtros
      </Button>
    </Card>
  );
}
