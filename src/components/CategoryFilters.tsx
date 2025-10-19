import React from "react";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground border-primary shadow-base"
              : "bg-card text-card-foreground border-border hover:border-primary hover:text-primary"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground border-primary shadow-base"
                : "bg-card text-card-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
