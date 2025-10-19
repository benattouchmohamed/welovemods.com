
import React from "react";
import { Link } from "react-router-dom";
import { Category } from "@/lib/data";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group border border-gray-100 dark:border-gray-700/50"
    >
      <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mb-3 text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <span>{category.icon}</span>
      </div>
      <span className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-app-purple dark:group-hover:text-app-purple-light transition-colors duration-300">{category.name}</span>
      <div className="mt-2 w-0 group-hover:w-1/2 h-0.5 bg-app-purple transition-all duration-300"></div>
    </Link>
  );
};

export default CategoryCard;
