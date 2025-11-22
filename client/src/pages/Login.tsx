import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Film, Mail, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Nota: Este endpoint necesita implementación en el backend
      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, nombre: nombre }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();

      // Loguear la respuesta para depuración (ver consola del navegador)
      console.debug("Login response:", { status: response.status, body: data });

      if (!data) {
        throw new Error("Respuesta vacía del servidor");
      }

      // Aceptar distintas formas en que el backend pueda devolver el usuario
      const usuarioFromResp = data.usuario ?? data.user ?? null;

      const nombreUsuario = usuarioFromResp?.nombre ?? data.nombre ?? data.correo ?? data.email ?? "Usuario";

      // Guardar token y usuario en localStorage (si existen)
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      const userToStore = usuarioFromResp ?? { nombre: nombreUsuario };
      localStorage.setItem("user", JSON.stringify(userToStore));

      // Redirigir al home antes de mostrar el toast
      setLocation("/");

      toast({
        title: "Bienvenido",
        description: `¡Hola ${nombreUsuario}!`,
      });
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: error instanceof Error ? error.message : "Credenciales incorrectas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-card/80 backdrop-blur-md border-card-border">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Film className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">PeliManiaticos</h1>
          <p className="text-muted-foreground">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="correo" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Correo electrónico
            </Label>
            <Input
              id="correo"
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="h-12"
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              nombre
            </Label>
            <Input
              id="nombre"
              placeholder="Ingresar nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="h-12"
              data-testid="input-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => setLocation("/registro")}
              className="text-primary hover:underline font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
