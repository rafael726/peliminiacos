import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import MovieDetail from "@/pages/MovieDetail";
import Catalog from "@/pages/Catalog";
import Favorites from "@/pages/Favorites";
import Users from "@/pages/Users";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CreateMovie from "@/pages/CreateMovie";
import UserStatistics from "@/pages/UserStatistics";
import TMDBImport from "@/pages/TMDBImport";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pelicula/:id" component={MovieDetail} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/favoritos" component={Favorites} />
      <Route path="/usuarios" component={Users} />
      <Route path="/usuarios/:id/estadisticas" component={UserStatistics} />
      <Route path="/buscar" component={Search} />
      <Route path="/login" component={Login} />
      <Route path="/registro" component={Register} />
      <Route path="/peliculas/crear" component={CreateMovie} />
      <Route path="/tmdb/importar" component={TMDBImport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferredTheme = savedTheme || "dark";
    setTheme(preferredTheme);
    
    if (preferredTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
