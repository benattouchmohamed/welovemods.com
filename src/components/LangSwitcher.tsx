// src/components/LangSelector.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface Lang {
  code: string;
  flag: string;
  label: string;
  native: string;
}

const languages: Lang[] = [
  { code: "en", flag: "United States", label: "English", native: "English" },
  { code: "es", flag: "Spain", label: "Español", native: "Español" },
  { code: "ko", flag: "South Korea", label: "한국어", native: "한국어" },
  { code: "ja", flag: "Japan", label: "日本語", native: "日本語" },
  { code: "ar", flag: "Saudi Arabia", label: "العربية", native: "العربية" },
  { code: "fr", flag: "France", label: "Français", native: "Français" },
  { code: "ru", flag: "Russia", label: "Русский", native: "Русский" },
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
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative flex justify-center mt-12 select-none">
      {/* Trigger Button – Flag Orb */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-16 h-16 rounded-full
          bg-gradient-to-br from-white to-gray-50
          shadow-xl ring-4 ring-white/50
          flex items-center justify-center text-4xl
          overflow-hidden
          transition-all duration-300
          hover:scale-110 hover:shadow-2xl
          focus:outline-none focus:ring-8 focus:ring-cartoon-blue/30
          ${isOpen ? "scale-95 ring-8 ring-cartoon-blue/40" : ""}
        `}
        aria-label={`Change language, current: ${current.label}`}
        whileTap={{ scale: 0.9 }}
      >
        {/* Animated Globe Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ rotate: isOpen ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Globe className="w-full h-full text-cartoon-blue" />
        </motion.div>

        {/* Flag */}
        <motion.span
          key={current.code}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="drop-shadow-md"
        >
          {current.flag}
        </motion.span>

        {/* Pulse Ring */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cartoon-blue/50"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Dropdown Portal – Floating Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
              absolute top-20 left-1/2 -translate-x-1/2
              w-80 p-5 bg-white/95 backdrop-blur-xl
              rounded-3xl shadow-2xl border border-gray-100
              z-50 overflow-hidden
            `}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-cartoon-blue">
                {locale === "ar" ? "اختر لغتك" : "Choose Language"}
              </h3>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-3 gap-3">
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
                      relative group flex flex-col items-center p-3 rounded-2xl
                      transition-all duration-200
                      ${isActive
                        ? "bg-gradient-to-br from-cartoon-blue/10 to-cartoon-purple/10 ring-2 ring-cartoon-blue shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100"
                      }
                    `}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    aria-label={`Switch to ${lang.label}`}
                  >
                    {/* Flag */}
                    <span className="text-3xl mb-1 drop-shadow-sm">{lang.flag}</span>

                    {/* Label */}
                    <span
                      className={`
                        text-xs font-bold
                        ${isActive ? "text-cartoon-blue" : "text-gray-700"}
                      `}
                    >
                      {lang.native}
                    </span>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeLangIndicator"
                        className="absolute inset-0 rounded-2xl bg-cartoon-blue/5"
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer Tip */}
            <p className="text-center text-xs text-gray-500 mt-4 font-medium">
              {locale === "ar" ? "نصائح التنزيل تتغير تلقائيًا" : "Download tips auto-update"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}