import React from "react";
import { Link } from "react-router-dom";

// Define theme colors for consistency with Categories
const themeColors = {
  primary: '#EC4899', // pink-600
  primaryDark: '#F472B6', // pink-400
  hover: '#DB2777', // pink-700
  hoverDark: '#F9A8D4', // pink-300
  backgroundDark: '#1F1F1F', // dark background
  cardBackground: '#2D2D2D', // card background
  border: '#3F3F3F', // border color
  secondaryText: '#D4D4D4', // secondary text
  placeholder: '#A1A1AA', // placeholder text
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden sm:block bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-700 font-inter"> <br />
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4">
          <Link
            to="/"
            className="text-lg font-semibold text-gray-800 dark:text-white hover:text-[${themeColors.primary}] transition-colors duration-200"
          >
            AppsMod
          </Link>
          <nav className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link
              to="/categories"
              className="hover:text-[${themeColors.primary}] dark:hover:text-[${themeColors.primaryDark}] transition-colors duration-200"
            >
              Categories
            </Link>
            <Link
              to="/top-games"
              className="hover:text-[${themeColors.primary}] dark:hover:text-[${themeColors.primaryDark}] transition-colors duration-200"
            >
              Top Games
            </Link>
            <Link
              to="/contact"
              className="hover:text-[${themeColors.primary}] dark:hover:text-[${themeColors.primaryDark}] transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} AppsMod. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
