import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pelicula } from "@shared/schema";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Clock, Calendar, ArrowLeft, Edit, Trash2, Save, X, Upload } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import placeholderImage from "@assets/generated_images/Movie_poster_placeholder_dd60c1d0.png";
import heroImage from "@assets/generated_images/Sci-fi_hero_backdrop_e6d7dfe2.png";

const CLASIFICACIONES = ["G", "PG", "PG-13", "R", "NC-17", "NR", "ATP", "+13", "+16", "+18"];

export default function MovieDetail() {
  const params = useParams();
  const movieId = Number(params.id);
  const [currentUserId] = useState<number>(1);
  const { favorites, toggleFavorite } = useFavorites(currentUserId);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Pelicula>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: movie, isLoading } = useQuery<Pelicula>({
    queryKey: ["/api/peliculas", movieId],
    enabled: !!movieId,
  });

  const { data: relatedMovies } = useQuery<Pelicula[]>({
    queryKey: ["/api/peliculas/populares/top", { limit: 6 }],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Pelicula>) => {
      const response = await fetch(`/api/peliculas/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar película");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/peliculas", movieId] });
      toast({ title: "¡Película actualizada!", description: "Los cambios se guardaron correctamente" });
      setIsEditOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo actualizar la película", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("imagen", file);
      
      const response = await fetch(`/api/peliculas/${movieId}/imagen`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al subir imagen");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/peliculas", movieId] });
      toast({ title: "¡Imagen subida!", description: "La portada se actualizó correctamente" });
      setIsImageUploadOpen(false);
      setImageFile(null);
      setImagePreview("");
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "No se pudo subir la imagen", 
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/peliculas/${movieId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar película");
    },
    onSuccess: () => {
      toast({ title: "Película eliminada", description: "La película se eliminó correctamente" });
      window.location.href = "/catalogo";
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar la película", variant: "destructive" });
    },
  });

  const handleEditClick = () => {
    if (movie) {
      setEditForm({
        titulo: movie.titulo,
        director: movie.director,
        genero: movie.genero,
        duracion: movie.duracion,
        año: movie.año,
        clasificacion: movie.clasificacion,
        sinopsis: movie.sinopsis,
        image_url: movie.image_url || "",
      });
      setIsEditOpen(true);
    }
  };

  const handleSaveEdit = () => {
    updateMutation.mutate(editForm);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast({ 
          title: "Error", 
          description: "La imagen es muy grande. Tamaño máximo: 5MB", 
          variant: "destructive" 
        });
        return;
      }
      
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({ 
          title: "Error", 
          description: "Formato no válido. Use JPG, PNG o WebP", 
          variant: "destructive" 
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (imageFile) {
      uploadImageMutation.mutate(imageFile);
    }
  };

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
							src={movie.image_url ? `http://localhost:8000${movie.image_url}` : heroImage} 
							alt={movie.titulo} 
							className="w-full h-full object-cover" 
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
						<div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
					</div>

					<div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<Link href="/">
							<Button variant="ghost" className="mt-6 backdrop-blur-md bg-black/20 hover:bg-black/40 text-white" data-testid="button-back">
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
									src={movie.image_url ? `http://localhost:8000${movie.image_url}` : placeholderImage} 
									alt={movie.titulo} 
									className="w-full aspect-[2/3] object-cover" 
								/>
							</Card>
						</div>

						<div className="lg:col-span-2 space-y-6">
							<div>
								<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4">{movie.titulo}</h1>

								<div className="flex flex-wrap gap-2 mb-6">
									{genres.map((genre, idx) => (
										<Badge key={idx} className="text-sm uppercase tracking-wide">
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
									<Badge variant="outline">{movie.clasificacion}</Badge>
								</div>

								<div className="flex gap-3 mb-8 flex-wrap">
									<Button size="lg" onClick={() => movie && toggleFavorite(movie.id)} variant={isFavorite ? "default" : "outline"} data-testid="button-toggle-favorite">
										<Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
										{isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
									</Button>

									<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" size="lg" onClick={handleEditClick}>
												<Edit className="w-5 h-5 mr-2" />
												Editar
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Editar Película</DialogTitle>
											</DialogHeader>
											<div className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="edit-titulo">Título</Label>
													<Input id="edit-titulo" value={editForm.titulo || ""} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })} />
												</div>
												<div className="space-y-2">
													<Label htmlFor="edit-director">Director</Label>
													<Input id="edit-director" value={editForm.director || ""} onChange={(e) => setEditForm({ ...editForm, director: e.target.value })} />
												</div>
												<div className="space-y-2">
													<Label htmlFor="edit-genero">Género</Label>
													<Input id="edit-genero" value={editForm.genero || ""} onChange={(e) => setEditForm({ ...editForm, genero: e.target.value })} />
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="edit-duracion">Duración (min)</Label>
														<Input
															id="edit-duracion"
															type="number"
															value={editForm.duracion || ""}
															onChange={(e) => setEditForm({ ...editForm, duracion: parseInt(e.target.value) })}
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="edit-año">Año</Label>
														<Input id="edit-año" type="number" value={editForm.año || ""} onChange={(e) => setEditForm({ ...editForm, año: parseInt(e.target.value) })} />
													</div>
												</div>
												<div className="space-y-2">
													<Label htmlFor="edit-clasificacion">Clasificación</Label>
													<Select value={editForm.clasificacion} onValueChange={(value) => setEditForm({ ...editForm, clasificacion: value })}>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{CLASIFICACIONES.map((c) => (
																<SelectItem key={c} value={c}>
																	{c}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="edit-image-url">URL de Imagen</Label>
													<Input 
														id="edit-image-url" 
														value={editForm.image_url || ""} 
														onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
														placeholder="https://ejemplo.com/imagen.jpg"
													/>
													<p className="text-xs text-muted-foreground">URL completa de la imagen de portada</p>
												</div>
												<div className="space-y-2">
													<Label htmlFor="edit-sinopsis">Sinopsis</Label>
													<Textarea id="edit-sinopsis" rows={4} value={editForm.sinopsis || ""} onChange={(e) => setEditForm({ ...editForm, sinopsis: e.target.value })} />
												</div>
												<div className="flex gap-2 justify-end pt-4">
													<Button variant="outline" onClick={() => setIsEditOpen(false)}>
														<X className="w-4 h-4 mr-2" />
														Cancelar
													</Button>
													<Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
														<Save className="w-4 h-4 mr-2" />
														{updateMutation.isPending ? "Guardando..." : "Guardar"}
													</Button>
												</div>
											</div>
									</DialogContent>
								</Dialog>

								<Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
									<DialogTrigger asChild>
										<Button variant="outline" size="lg">
											<Upload className="w-5 h-5 mr-2" />
											Cambiar Portada
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Subir Portada</DialogTitle>
										</DialogHeader>
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="movie-image">Seleccionar imagen</Label>
												<Input 
													id="movie-image" 
													type="file" 
													accept="image/jpeg,image/jpg,image/png,image/webp" 
													onChange={handleImageChange} 
													className="cursor-pointer" 
												/>
												<p className="text-xs text-muted-foreground">
													Formato: JPG, PNG, WebP. Tamaño máximo: 5MB
												</p>
											</div>

											{imagePreview && (
												<div className="space-y-2">
													<Label>Vista previa</Label>
													<div className="relative w-48 aspect-[2/3] mx-auto rounded-lg overflow-hidden border border-border">
														<img 
															src={imagePreview} 
															alt="Preview" 
															className="w-full h-full object-cover" 
														/>
													</div>
												</div>
											)}

											<div className="flex gap-2 justify-end pt-4">
												<Button
													variant="outline"
													onClick={() => {
														setIsImageUploadOpen(false);
														setImageFile(null);
														setImagePreview("");
													}}
												>
													<X className="w-4 h-4 mr-2" />
													Cancelar
												</Button>
												<Button 
													onClick={handleImageUpload} 
													disabled={!imageFile || uploadImageMutation.isPending}
												>
													<Upload className="w-4 h-4 mr-2" />
													{uploadImageMutation.isPending ? "Subiendo..." : "Subir Portada"}
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>

								<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
										<DialogTrigger asChild>
											<Button variant="destructive" size="lg">
												<Trash2 className="w-5 h-5 mr-2" />
												Eliminar
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>¿Eliminar película?</DialogTitle>
											</DialogHeader>
											<p className="text-muted-foreground">¿Estás seguro de que quieres eliminar "{movie.titulo}"? Esta acción no se puede deshacer.</p>
											<div className="flex gap-2 justify-end pt-4">
												<Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
													Cancelar
												</Button>
												<Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
													{deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</div>

							<Card className="p-6 bg-card border-card-border">
								<h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
								<p className="text-muted-foreground leading-relaxed">{movie.sinopsis}</p>
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
										<p className="font-medium">
											{movie.duracion} minutos ({Math.floor(movie.duracion / 60)}h {movie.duracion % 60}m)
										</p>
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
								{relatedMovies
									.filter((m) => m.id !== movieId)
									.slice(0, 5)
									.map((relatedMovie) => (
										<Link key={relatedMovie.id} href={`/pelicula/${relatedMovie.id}`}>
											<Card className="group overflow-hidden rounded-lg border-card-border hover:scale-105 transition-transform cursor-pointer">
												<div className="aspect-[2/3]">
													<img 
														src={relatedMovie.image_url ? `http://localhost:8000${relatedMovie.image_url}` : placeholderImage} 
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
