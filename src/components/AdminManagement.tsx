import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Eye, EyeOff, Trash2, Download, Upload } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

type Admin = Tables<"admins">;
type Game = Tables<"games">;

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{
    type: "delete" | "toggleStatus" | "deleteAllGames";
    id?: string;
    name?: string;
    currentStatus?: boolean;
  } | null>(null);
  const [securityCode, setSecurityCode] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const SECURITY_CODE = "2004";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      toast.error(`Failed to load administrators: ${error.message || "Unknown error"}`);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.error("All fields are required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("admins")
        .insert([{ email, name, role, password }])
        .select();

      if (error) {
        if (error.code === "23505") {
          toast.error("An admin with this email already exists");
        } else {
          toast.error(`Error adding admin: ${error.message}`);
        }
        return;
      }

      if (data && data.length > 0) {
        setAdmins([data[0], ...admins]);
        toast.success(`Admin ${name} added successfully`);
        setEmail("");
        setName("");
        setPassword("");
        setRole("Admin");
      }
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast.error(`Failed to add administrator: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!actionToConfirm || actionToConfirm.type !== "toggleStatus" || actionToConfirm.currentStatus === undefined) return;

    if (securityCode !== SECURITY_CODE) {
      toast.error("Incorrect security code");
      return;
    }

    try {
      const { error } = await supabase
        .from("admins")
        .update({ active: !actionToConfirm.currentStatus })
        .eq("id", actionToConfirm.id);

      if (error) throw error;

      setAdmins(
        admins.map((admin) =>
          admin.id === actionToConfirm.id ? { ...admin, active: !actionToConfirm.currentStatus } : admin
        )
      );

      toast.success(`Admin ${actionToConfirm.currentStatus ? "deactivated" : "activated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      toast.error(`Failed to update administrator status: ${error.message || "Unknown error"}`);
    } finally {
      setShowConfirmDialog(false);
      setActionToConfirm(null);
      setSecurityCode("");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!actionToConfirm || actionToConfirm.type !== "delete") return;

    if (securityCode !== SECURITY_CODE) {
      toast.error("Incorrect security code");
      return;
    }

    try {
      const { error } = await supabase.from("admins").delete().eq("id", actionToConfirm.id);

      if (error) throw error;

      setAdmins(admins.filter((admin) => admin.id !== actionToConfirm.id));
      toast.success(`Admin ${actionToConfirm.name} deleted successfully`);
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      toast.error(`Failed to delete administrator: ${error.message || "Unknown error"}`);
    } finally {
      setShowConfirmDialog(false);
      setActionToConfirm(null);
      setSecurityCode("");
    }
  };

  const handleDownloadAllGames = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("No games found to download");
        setIsLoading(false);
        return;
      }

      const formattedData = data.map((game) => ({
        ...game,
        created_at: game.created_at ? new Date(game.created_at).toISOString() : null,
      }));

      const jsonString = JSON.stringify(formattedData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `all_games_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${data.length} games successfully`);
    } catch (error: any) {
      console.error("Error downloading games:", error);
      toast.error(`Failed to download games: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllGames = async () => {
    if (securityCode !== SECURITY_CODE) {
      toast.error("Incorrect security code");
      return;
    }

    setIsLoading(true);
    try {
      // Get count for feedback
      const { count, error: countError } = await supabase
        .from("games")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      if (count === 0 || count === null) {
        toast.info("No games to delete");
        setShowConfirmDialog(false);
        setActionToConfirm(null);
        setSecurityCode("");
        setIsLoading(false);
        return;
      }

      // Supabase requires a filter; using a always-true condition
      const { error } = await supabase
        .from("games")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast.success(`Successfully deleted all ${count} games`);
    } catch (error: any) {
      console.error("Error deleting all games:", error);
      toast.error(`Failed to delete games: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
      setActionToConfirm(null);
      setSecurityCode("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/json") {
        toast.error("Please upload a valid JSON file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadGames = async () => {
    if (!file) {
      toast.error("Please select a JSON file to upload");
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          let games: Game[];
          try {
            games = JSON.parse(content);
          } catch (parseError) {
            toast.error("Invalid JSON format: File could not be parsed");
            return;
          }

          if (!Array.isArray(games)) {
            toast.error("Invalid JSON format: Expected an array of games");
            return;
          }

          if (games.length === 0) {
            toast.error("JSON file is empty: No games to upload");
            return;
          }

          const requiredFields = ["title"];
          for (const [index, game] of games.entries()) {
            for (const field of requiredFields) {
              if (!(field in game)) {
                toast.error(`Invalid game at index ${index}: Missing required field '${field}'`);
                return;
              }
            }
            if (game.created_at && isNaN(Date.parse(game.created_at as string))) {
              toast.error(`Invalid game at index ${index}: Invalid created_at format`);
              return;
            }
          }

          const validGames = games.map((game) => ({
            ...game,
            created_at: game.created_at ? new Date(game.created_at as string).toISOString() : new Date().toISOString(),
          }));

          const { error } = await supabase.from("games").insert(validGames);

          if (error) {
            if (error.code === "42501") toast.error("Permission denied: Check Supabase RLS policies");
            else if (error.code === "23502") toast.error("Missing required field in games data");
            else if (error.code === "23505") toast.error("Duplicate game entry detected");
            else toast.error(`Failed to upload games: ${error.message}`);
            return;
          }

          toast.success(`Successfully uploaded ${games.length} games`);
          setFile(null);
          const fileInput = document.getElementById("game-file") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        } catch (error: any) {
          toast.error(`Failed to process games: ${error.message || "Unknown error"}`);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read the uploaded file");
        setIsLoading(false);
      };

      reader.readAsText(file);
    } catch (error: any) {
      toast.error(`Failed to initiate file upload: ${error.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const openConfirmDialog = (
    type: "delete" | "toggleStatus" | "deleteAllGames",
    id?: string,
    name?: string,
    currentStatus?: boolean
  ) => {
    setActionToConfirm({ type, id, name, currentStatus });
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (actionToConfirm?.type === "delete") {
      handleDeleteAdmin();
    } else if (actionToConfirm?.type === "toggleStatus") {
      toggleStatus();
    } else if (actionToConfirm?.type === "deleteAllGames") {
      handleDeleteAllGames();
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Add New Administrator */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Administrator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Administrator Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-role">Role</Label>
                <select
                  id="admin-role"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? "Adding..." : "Add Admin"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Game Management */}
      <Card>
        <CardHeader>
          <CardTitle>Game Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Download */}
            <div className="flex items-center gap-4">
              <Button onClick={handleDownloadAllGames} disabled={isLoading} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Downloading..." : "Download All Games"}
              </Button>
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <Label htmlFor="game-file">Upload Games JSON</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  id="game-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                />
                <Button onClick={handleUploadGames} disabled={isLoading || !file}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading ? "Uploading..." : "Upload Games"}
                </Button>
              </div>
            </div>

            {/* Delete All Games */}
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                onClick={() => openConfirmDialog("deleteAllGames")}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Games
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Permanently removes <strong>all games</strong> from the database. This action cannot be undone.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Administrators List */}
      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No administrators found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">Role</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4">{admin.name}</td>
                      <td className="py-3 px-4">{admin.email}</td>
                      <td className="py-3 px-4">{admin.role}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admin.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openConfirmDialog("toggleStatus", admin.id, admin.name, admin.active)
                          }
                        >
                          {admin.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openConfirmDialog("delete", admin.id, admin.name)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-xl max-w-md w-full z-50">
            <AlertDialog.Title className="text-lg font-semibold">
              Confirm{" "}
              {actionToConfirm?.type === "delete"
                ? "Deletion"
                : actionToConfirm?.type === "deleteAllGames"
                ? "Delete All Games"
                : "Status Change"}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 text-sm text-muted-foreground">
              {actionToConfirm?.type === "delete"
                ? `Delete administrator "${actionToConfirm.name}" permanently?`
                : actionToConfirm?.type === "deleteAllGames"
                ? "This will permanently delete EVERY game in the database. This action is irreversible."
                : `${actionToConfirm?.currentStatus ? "Deactivate" : "Activate"} administrator "${actionToConfirm?.name}"?`}
            </AlertDialog.Description>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="security-code">Security Code</Label>
                <Input
                  id="security-code"
                  type="text"
                  placeholder="Enter security code (2004)"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <AlertDialog.Cancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button
                    variant={
                      actionToConfirm?.type === "delete" || actionToConfirm?.type === "deleteAllGames"
                        ? "destructive"
                        : "default"
                    }
                    onClick={handleConfirmAction}
                    disabled={securityCode !== SECURITY_CODE || isLoading}
                  >
                    {actionToConfirm?.type === "delete"
                      ? "Delete Admin"
                      : actionToConfirm?.type === "deleteAllGames"
                      ? "Delete All Games"
                      : actionToConfirm?.currentStatus
                      ? "Deactivate"
                      : "Activate"}
                  </Button>
                </AlertDialog.Action>
              </div>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default AdminManagement;