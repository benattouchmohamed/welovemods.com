
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Flame, Award, Sparkles, Wrench } from "lucide-react";

type FilterProps = {
  filters: {
    isMod: boolean;
    isPremium: boolean;
    isNew: boolean;
    isHot: boolean;
  };
  onFilterChange: (key: keyof FilterProps["filters"], value: boolean) => void;
};

const FilterBar = ({ filters, onFilterChange }: FilterProps) => {
  const handleToggle = (key: keyof FilterProps["filters"]) => {
    onFilterChange(key, !filters[key]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-3">Filter Games</h3>
      <div className="flex flex-wrap gap-2">
        <ToggleGroup type="multiple" variant="outline" className="justify-start">
          <ToggleGroupItem 
            value="isMod" 
            aria-label="Toggle MOD filter"
            data-state={filters.isMod ? "on" : "off"}
            onClick={() => handleToggle("isMod")}
            className="flex items-center gap-1"
          >
            <Wrench className="h-4 w-4" />
            <span>MOD</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="isPremium" 
            aria-label="Toggle Premium filter"
            data-state={filters.isPremium ? "on" : "off"}
            onClick={() => handleToggle("isPremium")}
            className="flex items-center gap-1"
          >
            <Award className="h-4 w-4" />
            <span>Premium</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="isNew" 
            aria-label="Toggle New filter"
            data-state={filters.isNew ? "on" : "off"}
            onClick={() => handleToggle("isNew")}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            <span>New</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="isHot" 
            aria-label="Toggle Hot filter"
            data-state={filters.isHot ? "on" : "off"}
            onClick={() => handleToggle("isHot")}
            className="flex items-center gap-1"
          >
            <Flame className="h-4 w-4" />
            <span>Hot</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default FilterBar;
