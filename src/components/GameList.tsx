// import React, { useState, useEffect } from "react";
// import { Plus, Edit, Trash2, Loader2, Search, Gamepad2, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Game, fetchGames, deleteGame } from "@/services/gameService";
// import GameForm from "@/components/GameForm";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";

// const GameList = () => {
//   const [games, setGames] = useState<Game[]>([]);
//   const [filteredGames, setFilteredGames] = useState<Game[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedGame, setSelectedGame] = useState<Game | null>(null);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [gameToDelete, setGameToDelete] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     loadGames();
//   }, []);

//   useEffect(() => {
//     handleSearch(searchQuery);
//   }, [games, searchQuery]);

//   const loadGames = async () => {
//     setLoading(true);
//     try {
//       const fetchedGames = await fetchGames();
//       const filtered = fetchedGames.filter((game) => game.title !== "Free Fire MOD");
//       setGames(filtered);
//     } catch (error) {
//       toast.error("Failed to load games");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     if (!query) {
//       setFilteredGames(games);
//       return;
//     }
//     const lowerQuery = query.toLowerCase();
//     setFilteredGames(
//       games.filter((game) =>
//         game.title.toLowerCase().includes(lowerQuery) ||
//         game.category.toLowerCase().includes(lowerQuery)
//       )
//     );
//   };

//   const handleAddNew = () => { setSelectedGame(null); setShowForm(true); };
//   const handleEdit = (game: Game) => { setSelectedGame(game); setShowForm(true); };
//   const handleDeleteClick = (id: string) => { setGameToDelete(id); setShowDeleteDialog(true); };

//   const confirmDelete = async () => {
//     if (!gameToDelete) return;
//     try {
//       const success = await deleteGame(gameToDelete);
//       if (success) {
//         setGames(games.filter((game) => game.id !== gameToDelete));
//         toast.success("Game removed from database");
//       }
//     } catch (error) {
//       toast.error("Delete failed");
//     } finally {
//       setShowDeleteDialog(false);
//       setGameToDelete(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFFBEB] p-4 lg:p-8 font-sans">
//       <AnimatePresence mode="wait">
//         {showForm ? (
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             exit={{ opacity: 0, y: -20 }}
//             key="form"
//           >
//             <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border-amber-100 shadow-[0_20px_50px_rgba(180,160,120,0.1)] rounded-[2.5rem] overflow-hidden">
//               <CardHeader className="border-b border-amber-50 bg-amber-50/30">
//                 <CardTitle className="text-amber-900 flex items-center gap-2">
//                   <Edit className="w-5 h-5 text-amber-600" />
//                   {selectedGame ? "Edit Production Data" : "Deploy New Mod"}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-8">
//                 <GameForm
//                   game={selectedGame || undefined}
//                   onSubmit={async (data) => {
//                     setIsSubmitting(true);
//                     // Add your actual logic here
//                     setShowForm(false);
//                     setIsSubmitting(false);
//                     loadGames();
//                   }}
//                   onCancel={() => setShowForm(false)}
//                   isSubmitting={isSubmitting}
//                 />
//               </CardContent>
//             </Card>
//           </motion.div>
//         ) : (
//           <motion.div 
//             initial={{ opacity: 0 }} 
//             animate={{ opacity: 1 }} 
//             key="list"
//             className="space-y-6 max-w-7xl mx-auto"
//           >
//             {/* Header Area */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Inventory Management</h1>
//                 <p className="text-amber-700/60 text-xs font-bold uppercase tracking-widest">Active Mod Database v2.0</p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="relative group">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 group-focus-within:text-amber-600 transition-colors" />
//                   <input
//                     type="text"
//                     placeholder="Filter assets..."
//                     className="pl-10 pr-4 py-2 bg-white border border-amber-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-200 focus:outline-none text-sm w-64 transition-all"
//                     value={searchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                   />
//                 </div>
//                 <Button
//                   onClick={handleAddNew}
//                   className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-6 shadow-[0_4px_0_0_#B45309] active:translate-y-1 active:shadow-none transition-all font-bold"
//                 >
//                   <Plus className="w-4 h-4 mr-2" /> Add Asset
//                 </Button>
//               </div>
//             </div>

//             {/* Main Content Card */}
//             <Card className="bg-white/70 backdrop-blur-md border-white shadow-[0_8px_32px_0_rgba(180,160,120,0.08)] rounded-[2.5rem] overflow-hidden border">
//               <CardContent className="p-0">
//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="relative mb-4">
//                       <div className="absolute inset-0 bg-amber-200 blur-2xl animate-pulse rounded-full" />
//                       <Loader2 className="w-10 h-10 animate-spin text-amber-600 relative z-10" />
//                     </div>
//                     <p className="text-amber-900/40 text-[10px] font-black uppercase tracking-[0.3em]">Synchronizing Data...</p>
//                   </div>
//                 ) : filteredGames.length === 0 ? (
//                   <div className="text-center py-20">
//                     <AlertCircle className="w-12 h-12 text-amber-200 mx-auto mb-4" />
//                     <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records found</p>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <Table>
//                       <TableHeader className="bg-amber-50/50">
//                         <TableRow className="border-none hover:bg-transparent">
//                           <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest px-6 py-5">Asset Title</TableHead>
//                           <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest">Category</TableHead>
//                           <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest">Build</TableHead>
//                           <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest">Rating</TableHead>
//                           <TableHead className="text-amber-900/40 font-black text-[10px] uppercase tracking-widest text-right px-6">Control</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {filteredGames.map((game) => (
//                           <TableRow 
//                             key={game.id} 
//                             className="border-amber-50 group hover:bg-amber-50/40 transition-colors"
//                           >
//                             <TableCell className="px-6 py-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold shadow-inner">
//                                   {game.title.charAt(0)}
//                                 </div>
//                                 <div>
//                                   <div className="font-bold text-slate-800">{game.title}</div>
//                                   <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
//                                     {game.isPremium ? "✦ Premium" : "Standard"}
//                                   </div>
//                                 </div>
//                               </div>
//                             </TableCell>
//                             <TableCell className="text-slate-500 font-medium text-sm">{game.category}</TableCell>
//                             <TableCell>
//                               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-200">
//                                 v{game.version}
//                               </span>
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-1 text-amber-500 font-bold">
//                                 <StarIcon size={12} fill="currentColor" /> {game.rating}
//                               </div>
//                             </TableCell>
//                             <TableCell className="text-right px-6">
//                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <Button
//                                   variant="ghost" size="icon"
//                                   className="h-9 w-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-100 transition-all"
//                                   onClick={() => handleEdit(game)}
//                                 >
//                                   <Edit className="w-4 h-4" />
//                                 </Button>
//                                 <Button
//                                   variant="ghost" size="icon"
//                                   className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
//                                   onClick={() => handleDeleteClick(game.id)}
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 3D Delete Modal */}
//       {showDeleteDialog && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-amber-900/20 backdrop-blur-sm animate-in fade-in duration-300">
//           <motion.div 
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white"
//           >
//             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//               <Trash2 className="w-8 h-8 text-red-500" />
//             </div>
//             <h3 className="text-xl font-black text-slate-900 text-center mb-2">Delete Asset?</h3>
//             <p className="text-slate-500 text-sm text-center mb-8">This will permanently remove the game data and associated links from production.</p>
//             <div className="grid grid-cols-2 gap-3">
//               <Button 
//                 variant="ghost" 
//                 className="rounded-2xl font-bold text-slate-400 hover:bg-slate-50"
//                 onClick={() => setShowDeleteDialog(false)}
//               >
//                 Abort
//               </Button>
//               <Button 
//                 className="bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-[0_4px_0_0_#991B1B]"
//                 onClick={confirmDelete}
//               >
//                 Confirm
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// const StarIcon = ({ size, fill }: { size: number; fill: string }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//   </svg>
// );

// export default GameList;

import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/types/supabase";
import { Trash2, Edit, Loader2, Search, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/data";

type Game = Tables<"games">;

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editGame, setEditGame] = useState<Game | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load games");
    } else {
      setGames(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabase.from("games").delete().eq("id", deleteId);
    if (error) {
      toast.error("Failed to delete game");
    } else {
      toast.success("Game deleted successfully");
      setGames((prev) => prev.filter((g) => g.id !== deleteId));
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const handleSaveEdit = async () => {
    if (!editGame) return;
    setSaving(true);
    const { error } = await supabase
      .from("games")
      .update({
        title: editGame.title,
        description: editGame.description,
        category: editGame.category,
        version: editGame.version,
        image_url: editGame.image_url,
        rating: editGame.rating,
        downloads: editGame.downloads,
        is_hot: editGame.is_hot,
        is_new: editGame.is_new,
        is_mod: editGame.is_mod,
        is_premium: editGame.is_premium,
        features: editGame.features,
      })
      .eq("id", editGame.id);
    if (error) {
      toast.error("Failed to update game");
    } else {
      toast.success("Game updated successfully");
      setGames((prev) => prev.map((g) => (g.id === editGame.id ? editGame : g)));
      setEditGame(null);
    }
    setSaving(false);
  };

  const filtered = games.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} game(s) found</p>

      <div className="divide-y divide-border">
        {filtered.map((game) => (
          <div key={game.id} className="flex items-center gap-4 py-3">
            <img
              src={game.image_url || "/placeholder.svg"}
              alt={game.title}
              className="w-14 h-14 rounded-xl object-cover bg-muted shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm truncate">{game.title}</h3>
                {game.is_hot && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Hot</Badge>}
                {game.is_new && <Badge className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-600">New</Badge>}
                {game.is_mod && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Mod</Badge>}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span>{game.category}</span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{game.rating}</span>
                <span className="flex items-center gap-0.5"><Download className="w-3 h-3" />{formatNumber(game.downloads)}</span>
                <span>v{game.version}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditGame({ ...game })}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(game.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">No games found.</p>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The game will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editGame} onOpenChange={() => setEditGame(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
          </DialogHeader>
          {editGame && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <Input value={editGame.title} onChange={(e) => setEditGame({ ...editGame, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm min-h-[80px]"
                  value={editGame.description || ""}
                  onChange={(e) => setEditGame({ ...editGame, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <Input value={editGame.category} onChange={(e) => setEditGame({ ...editGame, category: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Version</label>
                  <Input value={editGame.version} onChange={(e) => setEditGame({ ...editGame, version: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Image URL</label>
                <Input value={editGame.image_url || ""} onChange={(e) => setEditGame({ ...editGame, image_url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Rating</label>
                  <Input type="number" step="0.1" min="0" max="5" value={editGame.rating} onChange={(e) => setEditGame({ ...editGame, rating: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Downloads</label>
                  <Input type="number" value={editGame.downloads} onChange={(e) => setEditGame({ ...editGame, downloads: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Features (comma separated)</label>
                <Input
                  value={(editGame.features || []).join(", ")}
                  onChange={(e) => setEditGame({ ...editGame, features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean) })}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                {(["is_hot", "is_new", "is_mod", "is_premium"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editGame[key]}
                      onChange={(e) => setEditGame({ ...editGame, [key]: e.target.checked })}
                      className="rounded"
                    />
                    {key.replace("is_", "").charAt(0).toUpperCase() + key.replace("is_", "").slice(1)}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditGame(null)}>Cancel</Button>
                <Button onClick={handleSaveEdit} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameList;
