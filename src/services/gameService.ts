
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Game {
  id: string;
  title: string;
  category: string;
  image_url: string;
  imageUrl?: string; 
  rating: number;
  size?: string;
  version: string;
  is_mod: boolean;
  isMod?: boolean;
  is_premium: boolean;
  isPremium?: boolean;
  is_new?: boolean;
  isNew?: boolean;
  is_hot?: boolean;
  isHot?: boolean;
  downloads: number;
  description: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export const fetchGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to load games");
      return [];
    }

    // Convert from snake_case to camelCase for compatibility
    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (err) {
    console.error("Error fetching games:", err);
    toast.error("Failed to load games");
    return [];
  }
};

export const fetchGameById = async (id: string): Promise<Game | null> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching game:", error);
      toast.error("Failed to load game details");
      return null;
    }

    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (err) {
    console.error("Error fetching game:", err);
    toast.error("Failed to load game details");
    return null;
  }
};

export const fetchGameBySlug = async (slug: string): Promise<Game | null> => {
  try {
    const searchPattern = `%${slug.replace(/-/g, '%')}%`;
    
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .ilike('title', searchPattern)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching game by slug:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (error) {
    console.error('Error in fetchGameBySlug:', error);
    return null;
  }
};

export const createGame = async (game: Partial<Game>): Promise<Game | null> => {
  try {
    const newGame = {
      title: game.title || "Untitled Game",
      category: game.category || "Action",
      image_url: game.image_url || game.imageUrl || "/placeholder.svg",
      rating: game.rating || 0,
      version: game.version || "1.0.0",
      is_mod: game.isMod || game.is_mod || false,
      is_premium: game.isPremium || game.is_premium || false,
      is_new: game.isNew || game.is_new || false,
      is_hot: game.isHot || game.is_hot || false,
      downloads: game.downloads || 0,
      description: game.description || "",
      features: Array.isArray(game.features) ? game.features : []
    };

    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game: " + error.message);
      return null;
    }
    
    toast.success("Game created successfully");
    
    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (err) {
    console.error("Error creating game:", err);
    toast.error("Failed to create game");
    return null;
  }
};

export const updateGame = async (id: string, game: Partial<Game>): Promise<Game | null> => {
  try {
    const updateData: any = {};
    
    if (game.title !== undefined) updateData.title = game.title;
    if (game.category !== undefined) updateData.category = game.category;
    if (game.image_url !== undefined || game.imageUrl !== undefined) {
      updateData.image_url = game.image_url || game.imageUrl;
    }
    if (game.rating !== undefined) updateData.rating = game.rating;
    if (game.version !== undefined) updateData.version = game.version;
    if (game.isMod !== undefined || game.is_mod !== undefined) {
      updateData.is_mod = game.isMod !== undefined ? game.isMod : game.is_mod;
    }
    if (game.isPremium !== undefined || game.is_premium !== undefined) {
      updateData.is_premium = game.isPremium !== undefined ? game.isPremium : game.is_premium;
    }
    if (game.isNew !== undefined || game.is_new !== undefined) {
      updateData.is_new = game.isNew !== undefined ? game.isNew : game.is_new;
    }
    if (game.isHot !== undefined || game.is_hot !== undefined) {
      updateData.is_hot = game.isHot !== undefined ? game.isHot : game.is_hot;
    }
    if (game.downloads !== undefined) updateData.downloads = game.downloads;
    if (game.description !== undefined) updateData.description = game.description;
    if (game.features !== undefined) updateData.features = Array.isArray(game.features) ? game.features : [];
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating game:", error);
      toast.error("Failed to update game: " + error.message);
      return null;
    }
    
    toast.success("Game updated successfully");
    
    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (err) {
    console.error("Error updating game:", err);
    toast.error("Failed to update game");
    return null;
  }
};

export const deleteGame = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game: " + error.message);
      return false;
    }
    
    toast.success("Game deleted successfully");
    return true;
  } catch (err) {
    console.error("Error deleting game:", err);
    toast.error("Failed to delete game");
    return false;
  }
};

export const fetchGamesByCategory = async (category: string): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games by category:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchGamesByCategory:', error);
    throw error;
  }
};

export const fetchTopGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('downloads', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching top games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchTopGames:', error);
    throw error;
  }
};

export const fetchNewGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching new games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchNewGames:', error);
    throw error;
  }
};

export const fetchHotGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_hot', true)
      .order('downloads', { ascending: false });

    if (error) {
      console.error('Error fetching hot games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchHotGames:', error);
    throw error;
  }
};

export const searchGames = async (query: string): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('downloads', { ascending: false });

    if (error) {
      console.error('Error searching games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in searchGames:', error);
    throw error;
  }
};




