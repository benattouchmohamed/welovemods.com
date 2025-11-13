import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "@/hooks/useLocale";

const languages = [
  { code: "en", flag: "US", name: "English" },
  { code: "de", flag: "DE", name: "Deutsch" }, 
  { code: "es", flag: "ES", name: "Español" },
    { code: "fr", flag: "FR", name: "Français" },
     { code: "ar", flag: "SA", name: "العربية" },

  { code: "ko", flag: "KR", name: "한국어" },
  { code: "ja", flag: "JP", name: "日本語" },
 
  { code: "ru", flag: "RU", name: "Русский" },
  
] as const;

export default function LangPicker() {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === locale) ?? languages[0];

  /* Close on click outside */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative z-10">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center gap-2 px-3.5 py-1.5 rounded-full
          bg-white border border-gray-300
          shadow-sm hover:shadow transition-shadow duration-200
          text-xs font-medium text-gray-800
          focus:outline-none focus:ring-2 focus:ring-purple-500/50
        `}
      >
        <Globe className="w-3.5 h-3.5 text-purple-600" />
        <ReactCountryFlag
          countryCode={current.flag}
          svg
          className="w-4 h-4 rounded-sm shadow-sm"
        />
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48
            bg-white rounded-xl shadow-xl border border-gray-200
            overflow-hidden z-50
            animate-in fade-in-0 zoom-in-95 duration-150
          `}
        >
          <div
            className="p-2 space-y-1 max-h-64 overflow-y-auto
                       scrollbar-thin scrollbar-thumb-purple-600
                       scrollbar-track-transparent"
          >
            {languages.map((lang) => {
              const active = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code as any);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs
                    transition-all duration-150 font-medium
                    ${
                      active
                        ? "bg-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <ReactCountryFlag
                    countryCode={lang.flag}
                    svg
                    className="w-5 h-5 rounded shadow-sm flex-shrink-0"
                  />
                  <span className="flex-1 text-left">{lang.name}</span>
                  {active && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}