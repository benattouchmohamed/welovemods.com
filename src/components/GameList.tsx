import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Loader2, Search } from "lucide-react";
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
      const filtered = fetchedGames.filter(
        (game) => game.title !== "Free Fire MOD"
      );
      setGames(filtered);
      setFilteredGames(filtered);
    } catch (error) {
      console.error("Failed to load games:", error);
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
      games.filter(
        (game) =>
          game.title.toLowerCase().includes(lowerQuery) ||
          game.category.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleAddNew = () => {
    setSelectedGame(null);
    setShowForm(true);
  };

  const handleEdit = (game: Game) => {
    setSelectedGame(game);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setGameToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!gameToDelete) return;

    try {
      const success = await deleteGame(gameToDelete);
      if (success) {
        setGames(games.filter((game) => game.id !== gameToDelete));
        toast.success("Game deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game");
    } finally {
      setShowDeleteDialog(false);
      setGameToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setGameToDelete(null);
  };

  const handleFormSubmit = async (game: Partial<Game>) => {
    setIsSubmitting(true);
    try {
      if (selectedGame) {
        setGames(
          games.map((g) =>
            g.id === selectedGame.id ? { ...g, ...game } as Game : g
          )
        );
        toast.success("Game updated successfully");
      } else if (game.id) {
        setGames([...games, game as Game]);
        toast.success("Game added successfully");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting game:", error);
      toast.error("Failed to save game");
    } finally {
      setIsSubmitting(false);
      setShowForm(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <>
      {/* Search Input */}
      {!showForm && (
        <div className="mb-4 flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <input
            type="text"
            placeholder="Search games..."
            className="border border-blue-300 dark:border-blue-700 rounded px-3 py-1 w-full dark:bg-blue-950 dark:text-blue-100"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      {/* Rest of your Card and Table */}
      {showForm ? (
        <Card className="bg-white dark:bg-blue-950 border-blue-200 dark:border-blue-900 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              {selectedGame ? "Edit Game" : "Add New Game"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GameForm
              game={selectedGame || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-blue-950 border-blue-200 dark:border-blue-900 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-900 dark:text-blue-100">Games</CardTitle>
            <Button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white animate-bounce-in"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Game
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-500" />
                <p className="mt-2 text-blue-900 dark:text-blue-100">Loading games...</p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-8 text-blue-700 dark:text-blue-200">
                <p className="mb-4">No games found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="animate-fade-in-up">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-red-600 to-blue-600 dark:from-red-500 dark:to-blue-500">
                      <TableHead className="text-white">Title</TableHead>
                      <TableHead className="text-white">Category</TableHead>
                      <TableHead className="text-white">Version</TableHead>
                      <TableHead className="text-white">MOD</TableHead>
                      <TableHead className="text-white">Premium</TableHead>
                      <TableHead className="text-white">Rating</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGames.map((game, index) => (
                      <TableRow
                        key={game.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white dark:bg-blue-900' : 'bg-gray-50 dark:bg-blue-950'
                        } hover:bg-blue-100 dark:hover:bg-blue-800 hover:scale-up`}
                      >
                        <TableCell className="font-medium text-blue-900 dark:text-blue-100">
                          {game.title}
                        </TableCell>
                        <TableCell className="text-blue-900 dark:text-blue-100">
                          {game.category}
                        </TableCell>
                        <TableCell className="text-blue-900 dark:text-blue-100">
                          {game.version}
                        </TableCell>
                        <TableCell className="text-blue-900 dark:text-blue-100">
                          {game.isMod ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-blue-900 dark:text-blue-100">
                          {game.isPremium ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-blue-900 dark:text-blue-100">
                          {game.rating}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(game)}
                              disabled={loading}
                              className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:scale-up"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:scale-up"
                              onClick={() => handleDeleteClick(game.id)}
                              disabled={loading}
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
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-blue-950 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-blue-700 dark:text-blue-200 mb-6">
              Are you sure you want to delete this game? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="border-blue-300 dark:border-blue-500 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900 animate-bounce-in"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-400 animate-bounce-in"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameList;
