import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import React, { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// Eager load critical route
import Index from "./pages/Index";

// Lazy load all other routes for code splitting
const Admin = lazy(() => import("./pages/Admin"));
const GameDetail = lazy(() => import("./pages/GameDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Categories = lazy(() => import("./pages/Categories"));
const TopGames = lazy(() => import("./pages/TopGames"));
const NewGames = lazy(() => import("./pages/NewGames"));
const AllGames = lazy(() => import("./pages/AllGames"));
const Download = lazy(() => import("./pages/Download"));
const G1 = lazy(() => import("./pages/g1.tsx"));
const Adblue = lazy(() => import("./pages/adblue.tsx"));
const BlogGuide = lazy(() => import("./pages/GameBlog.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min cache
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Minimal fallback for lazy routes
const PageFallback = () => (
  <div className="min-h-screen bg-[hsl(var(--card))] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-3 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
                <Route path="/game/:slug?" element={<GameDetail />} />
                <Route path="/blog/:blogSlug" element={<BlogGuide />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/top-games" element={<TopGames />} />
                <Route path="/new-games" element={<NewGames />} />
                <Route path="/all-games" element={<AllGames />} />
                <Route path="/download" element={<Download />} />
                <Route path="/Download/:appName" element={<Download />} />
                <Route path="/Click-Here" element={<G1 />} />
                <Route path="/adblue" element={<Adblue />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
