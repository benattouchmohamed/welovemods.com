// src/components/LangSelector.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface Lang {
  code: string;
  flag: string;
  label: string;     // English name
  native: string;    // Native name
}

const languages: Lang[] = [
  { code: "en", flag: "United States", label: "English", native: "English" },
  { code: "es", flag: "Spain", label: "Spanish", native: "Español" },
  { code: "ko", flag: "South Korea", label: "Korean", native: "한국어" },
  { code: "ja", flag: "Japan", label: "Japanese", native: "日本語" },
  { code: "ar", flag: "Saudi Arabia", label: "Arabic", native: "العربية" },
  { code: "fr", flag: "France", label: "French", native: "Français" },
  { code: "ru", flag: "Russia", label: "Russian", native: "Русский" },
];

export default function LangSelector() {
  const [locale, setLocale] = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) || languages[0];

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5
          bg-white rounded-xl shadow-lg
          border border-gray-200
          text-cartoon-blue font-bold text-sm
          hover:shadow-xl hover:border-cartoon-blue/50
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-cartoon-blue/20
        `}
        whileTap={{ scale: 0.98 }}
        aria-label="Select language"
      >
        <span className="text-xl">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-cartoon-blue" />
        </motion.div>
      </motion.button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
              mt-2 w-56 bg-white rounded-xl shadow-2xl
              border border-gray-100 overflow-hidden
            `}
          >
            {languages.map((lang, i) => {
              const isActive = locale === lang.code;

              return (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    text-left transition-all
                    ${isActive
                      ? "bg-cartoon-blue/5 font-bold text-cartoon-blue"
                      : "hover:bg-gray-50 text-gray-700"
                    }
                  `}
                  initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: locale === "ar" ? -4 : 4 }}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{lang.native}</div>
                    <div className="text-xs text-gray-500">{lang.label}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeLangCheck"
                      className="w-5 h-5 rounded-full bg-cartoon-green flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}