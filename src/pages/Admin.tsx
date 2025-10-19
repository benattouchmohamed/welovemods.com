import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserCircle, LayoutGrid, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signOut, getAdminName, getAdminRole } from "@/services/authService";
import GameList from "@/components/GameList";
import AdminManagement from "@/components/AdminManagement";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"games" | "admins">("games");
  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAdminName(getAdminName());
    setAdminRole(getAdminRole());
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const success = await signOut();
      if (success) {
        toast.success("Logout successful!");
        setTimeout(() => {
          window.location.reload();
          navigate("/admin-login");
        }, 1000);
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 shadow-md py-3 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <Link
            to="/"
            className="text-white font-bold text-xl tracking-tight mb-2 sm:mb-0"
          >
            AppsMod Admin
          </Link>

          <div className="flex items-center space-x-3">
            <div className="flex items-center text-white text-sm sm:text-base">
              <UserCircle className="w-5 h-5 mr-1 text-white/80" />
              {adminName || "Administrator"}
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded font-medium">
                {adminRole || "Admin"}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 text-indigo-600 border border-indigo-300 hover:bg-white transition"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant={activeTab === "games" ? "default" : "outline"}
            className={`flex items-center justify-center w-full sm:w-auto ${
              activeTab === "games"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-white/10 text-slate-200 border border-slate-600 hover:bg-white/20"
            }`}
            onClick={() => setActiveTab("games")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Games
          </Button>
          <Button
            variant={activeTab === "admins" ? "default" : "outline"}
            className={`flex items-center justify-center w-full sm:w-auto ${
              activeTab === "admins"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-white/10 text-slate-200 border border-slate-600 hover:bg-white/20"
            }`}
            onClick={() => setActiveTab("admins")}
          >
            <Users className="w-4 h-4 mr-2" />
            Administrators
          </Button>
        </div>
      </div>
{/* Main Content */}
<main className="container mx-auto px-4 py-6 flex-grow">
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
      {activeTab === "games" ? "🎮 Games Management" : "🛡️ Admin Management"}
    </h1>

    {activeTab === "games" && (
      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md">
        + Add New Game
      </Button>
    )}

    {activeTab === "admins" && (
      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md">
        + Add New Admin
      </Button>
    )}
  </div>

  <div className="bg-slate-800 rounded-2xl shadow-xl p-5 sm:p-8 border border-slate-700">
    {activeTab === "games" ? (
      <>
        <p className="text-slate-300 mb-4 text-sm sm:text-base">
          Manage all uploaded games, edit details, or remove unwanted entries below.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/50">
          <GameList />
        </div>
      </>
    ) : (
      <>
        <p className="text-slate-300 mb-4 text-sm sm:text-base">
          Manage administrator accounts, assign roles, and control access permissions.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/50">
          <AdminManagement />
        </div>
      </>
    )}
  </div>
</main>

      {/* Footer */}
      <footer className="bg-slate-900 py-4 text-center text-xs sm:text-sm text-slate-400 border-t border-slate-700">
        <p>
          &copy; {new Date().getFullYear()} AppsMod Admin. Built by{" "}
          <a
            href="https://instagram.com/simobeen_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline font-medium"
          >
            @simobeen_
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Admin;
