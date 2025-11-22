import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Film, Save, X } from "lucide-react";

const CLASIFICACIONES = ["G", "PG", "PG-13", "R", "NC-17", "NR", "ATP", "+13", "+16", "+18"];

export default function CreateMovie() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    director: "",
    genero: "",
    duracion: "",
    año: "",
    clasificacion: "",
    sinopsis: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const movieData = {
        titulo: formData.titulo,
        director: formData.director,
        genero: formData.genero,
        duracion: parseInt(formData.duracion),
        año: parseInt(formData.año),
        clasificacion: formData.clasificacion,
        sinopsis: formData.sinopsis,
      };

      const response = await fetch("/api/peliculas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        let errorMessage = "Error al crear película";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await response.json();
            errorMessage = error.detail || error.message || errorMessage;
          } else {
            const textError = await response.text();
            console.error("Error response:", textError);
            errorMessage = `Error del servidor (${response.status})`;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      toast({
        title: "¡Película creada!",
        description: `"${data.titulo}" se ha agregado correctamente. Puedes editar la película para agregar una portada.`,
      });

      setLocation(`/pelicula/${data.id}`);
    } catch (error) {
      console.error("Error creating movie:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la película",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
              <Film className="w-8 h-8 text-primary" />
              Agregar Nueva Película
            </h1>
            <p className="text-muted-foreground">
              Completa la información para agregar una película al catálogo
            </p>
          </div>

          <Card className="p-6 sm:p-8 bg-card border-card-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    placeholder="Inception"
                    value={formData.titulo}
                    onChange={(e) => handleChange("titulo", e.target.value)}
                    required
                    className="h-12"
                    data-testid="input-titulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="director">Director *</Label>
                  <Input
                    id="director"
                    placeholder="Christopher Nolan"
                    value={formData.director}
                    onChange={(e) => handleChange("director", e.target.value)}
                    required
                    className="h-12"
                    data-testid="input-director"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <Input
                    id="genero"
                    placeholder="Ciencia Ficción, Acción"
                    value={formData.genero}
                    onChange={(e) => handleChange("genero", e.target.value)}
                    required
                    className="h-12"
                    data-testid="input-genero"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (minutos) *</Label>
                  <Input
                    id="duracion"
                    type="number"
                    min="1"
                    max="600"
                    placeholder="148"
                    value={formData.duracion}
                    onChange={(e) => handleChange("duracion", e.target.value)}
                    required
                    className="h-12"
                    data-testid="input-duracion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="año">Año *</Label>
                  <Input
                    id="año"
                    type="number"
                    min="1888"
                    max={currentYear}
                    placeholder="2010"
                    value={formData.año}
                    onChange={(e) => handleChange("año", e.target.value)}
                    required
                    className="h-12"
                    data-testid="input-año"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clasificacion">Clasificación *</Label>
                  <Select
                    value={formData.clasificacion}
                    onValueChange={(value) => handleChange("clasificacion", value)}
                    required
                  >
                    <SelectTrigger className="h-12" data-testid="select-clasificacion">
                      <SelectValue placeholder="Selecciona una clasificación" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASIFICACIONES.map((clasificacion) => (
                        <SelectItem key={clasificacion} value={clasificacion}>
                          {clasificacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="sinopsis">Sinopsis *</Label>
                  <Textarea
                    id="sinopsis"
                    placeholder="Escribe una breve sinopsis de la película..."
                    value={formData.sinopsis}
                    onChange={(e) => handleChange("sinopsis", e.target.value)}
                    required
                    rows={5}
                    className="resize-none"
                    data-testid="textarea-sinopsis"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base font-medium"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Guardando..." : "Crear Película"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/catalogo")}
                  className="h-12"
                  data-testid="button-cancel"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
