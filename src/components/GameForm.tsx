
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Game, createGame, updateGame } from "@/services/gameService";

interface GameFormProps {
  game?: Game;
  onSubmit: (game: Partial<Game>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const defaultGame: Partial<Game> = {
  title: "",
  category: "Action",
  image_url: "/placeholder.svg",
  imageUrl: "/placeholder.svg",
  rating: 4.0,
  version: "1.0.0",
  is_mod: true,
  isMod: true,
  is_premium: false,
  isPremium: false,
  downloads: 0,
  description: "",
  features: []
};

const GameForm: React.FC<GameFormProps> = ({ game, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Game>>(game || defaultGame);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      if (name === "isMod") {
        setFormData(prev => ({
          ...prev,
          isMod: isChecked,
          is_mod: isChecked
        }));
      } else if (name === "isPremium") {
        setFormData(prev => ({
          ...prev,
          isPremium: isChecked,
          is_premium: isChecked
        }));
      } else if (name === "isNew") {
        setFormData(prev => ({
          ...prev,
          isNew: isChecked,
          is_new: isChecked
        }));
      } else if (name === "isHot") {
        setFormData(prev => ({
          ...prev,
          isHot: isChecked,
          is_hot: isChecked
        }));
      }
    } else if (name === "rating" || name === "downloads") {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else if (name === "imageUrl") {
      setFormData(prev => ({
        ...prev,
        imageUrl: value,
        image_url: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (game?.id) {
        // Update existing game
        await updateGame(game.id, formData);
      } else {
        // Create new game
        await createGame(formData);
      }
      onSubmit(formData);
    } catch (error) {
      console.error("Error saving game:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Game Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select 
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            required
          >
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Strategy">Strategy</option>
            <option value="RPG">RPG</option>
            <option value="MOBA">MOBA</option>
          </select>
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || formData.image_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              id="isMod"
              name="isMod"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-app-purple focus:ring-app-purple"
              checked={formData.isMod || formData.is_mod}
              onChange={handleChange}
            />
            <Label htmlFor="isMod">Is MOD</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isPremium"
              name="isPremium"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-app-purple focus:ring-app-purple"
              checked={formData.isPremium || formData.is_premium}
              onChange={handleChange}
            />
            <Label htmlFor="isPremium">Is Premium</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              id="isNew"
              name="isNew"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-app-purple focus:ring-app-purple"
              checked={formData.isNew || formData.is_new}
              onChange={handleChange}
            />
            <Label htmlFor="isNew">Is New</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isHot"
              name="isHot"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-app-purple focus:ring-app-purple"
              checked={formData.isHot || formData.is_hot}
              onChange={handleChange}
            />
            <Label htmlFor="isHot">Is Hot</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="downloads">Downloads</Label>
          <Input
            id="downloads"
            name="downloads"
            type="number"
            min="0"
            value={formData.downloads}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div>
          <Label>Features</Label>
          <div className="mt-2 space-y-2">
            {formData.features?.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="flex-1 p-2 bg-gray-50 rounded">{feature}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="ml-2"
              onClick={handleAddFeature}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-app-purple hover:bg-app-purple-dark"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : game?.id ? 'Update Game' : 'Add Game'}
        </Button>
      </div>
    </form>
  );
};

export default GameForm;
