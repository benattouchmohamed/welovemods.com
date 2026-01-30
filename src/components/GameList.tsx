import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Search, Gamepad2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Game, fetchGames, deleteGame } from "@/services/gameService";
import GameForm from "@/components/GameForm";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [games, searchQuery]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const fetchedGames = await fetchGames();
      const filtered = fetchedGames.filter((game) => game.title !== "Free Fire MOD");
      setGames(filtered);
    } catch (error) {
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredGames(games);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setFilteredGames(
      games.filter((game) =>
        game.title.toLowerCase().includes(lowerQuery) ||
        game.category.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleAddNew = () => { setSelectedGame(null); setShowForm(true); };
  const handleEdit = (game: Game) => { setSelectedGame(game); setShowForm(true); };
  const handleDeleteClick = (id: string) => { setGameToDelete(id); setShowDeleteDialog(true); };

  const confirmDelete = async () => {
    if (!gameToDelete) return;
    try {
      const success = await deleteGame(gameToDelete);
      if (success) {
        setGames(games.filter((game) => game.id !== gameToDelete));
        toast.success("Game removed from database");
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setShowDeleteDialog(false);
      setGameToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-4 lg:p-8 font-sans">
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            key="form"
          >
            <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border-amber-100 shadow-[0_20px_50px_rgba(180,160,120,0.1)] rounded-[2.5rem] overflow-hidden">
              <CardHeader className="border-b border-amber-50 bg-amber-50/30">
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-600" />
                  {selectedGame ? "Edit Production Data" : "Deploy New Mod"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <GameForm
                  game={selectedGame || undefined}
                  onSubmit={async (data) => {
                    setIsSubmitting(true);
                    // Add your actual logic here
                    setShowForm(false);
                    setIsSubmitting(false);
                    loadGames();
                  }}
                  onCancel={() => setShowForm(false)}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            key="list"
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Inventory Management</h1>
                <p className="text-amber-700/60 text-xs font-bold uppercase tracking-widest">Active Mod Database v2.0</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 group-focus-within:text-amber-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Filter assets..."
                    className="pl-10 pr-4 py-2 bg-white border border-amber-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-200 focus:outline-none text-sm w-64 transition-all"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddNew}
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-6 shadow-[0_4px_0_0_#B45309] active:translate-y-1 active:shadow-none transition-all font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Asset
                </Button>
              </div>
            </div>

            {/* Main Content Card */}
            <Card className="bg-white/70 backdrop-blur-md border-white shadow-[0_8px_32px_0_rgba(180,160,120,0.08)] rounded-[2.5rem] overflow-hidden border">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-amber-200 blur-2xl animate-pulse rounded-full" />
                      <Loader2 className="w-10 h-10 animate-spin text-amber-600 relative z-10" />
                    </div>
                    <p className="text-amber-900/40 text-[10px] font-black uppercase tracking-[0.3em]">Synchronizing Data...</p>
                  </div>
                ) : filteredGames.length === 0 ? (
                  <div className="text-center py-20">
                    <AlertCircle className="w-12 h-12 text-amber-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-amber-50/50">
                        <TableRow className="border-none hover:bg-transparent">
                          <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest px-6 py-5">Asset Title</TableHead>
                          <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest">Category</TableHead>
                          <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest">Build</TableHead>
                          <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest">Rating</TableHead>
                          <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest text-right px-6">Control</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGames.map((game) => (
                          <TableRow 
                            key={game.id} 
                            className="border-amber-50 group hover:bg-amber-50/40 transition-colors"
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold shadow-inner">
                                  {game.title.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">{game.title}</div>
                                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                                    {game.isPremium ? "✦ Premium" : "Standard"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-500 font-medium text-sm">{game.category}</TableCell>
                            <TableCell>
                              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-200">
                                v{game.version}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <StarIcon size={12} fill="currentColor" /> {game.rating}
                              </div>
                            </TableCell>
                            <TableCell className="text-right px-6">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-9 w-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-100 transition-all"
                                  onClick={() => handleEdit(game)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                  onClick={() => handleDeleteClick(game.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Delete Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-amber-900/20 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white"
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">Delete Asset?</h3>
            <p className="text-slate-500 text-sm text-center mb-8">This will permanently remove the game data and associated links from production.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="ghost" 
                className="rounded-2xl font-bold text-slate-400 hover:bg-slate-50"
                onClick={() => setShowDeleteDialog(false)}
              >
                Abort
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-[0_4px_0_0_#991B1B]"
                onClick={confirmDelete}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StarIcon = ({ size, fill }: { size: number; fill: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default GameList;
