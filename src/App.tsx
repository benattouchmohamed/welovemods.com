import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import GameDetail from "./pages/GameDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Categories from "./pages/Categories";
import TopGames from "./pages/TopGames";
import NewGames from "./pages/NewGames";
import AllGames from "./pages/AllGames";
import Download from "./pages/Download"; // Import the Download component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route path="/game/:slug?" element={<GameDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/top-games" element={<TopGames />} />
                          <Route path="/download" element={<Download />} />

              <Route path="/new-games" element={<NewGames />} />
              <Route path="/all-games" element={<AllGames />} />
              <Route path="/Download/:appName" element={<Download />} /> {/* Added Download route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;