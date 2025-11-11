import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "@/hooks/useLocale";

const languages = [
  { code: "en", flag: "US", name: "English" },
  { code: "es", flag: "ES", name: "Español" },
  { code: "ko", flag: "KR", name: "한국어" },
  { code: "ja", flag: "JP", name: "日本語" },
  { code: "ar", flag: "SA", name: "العربية" },
  { code: "fr", flag: "FR", name: "Français" },
  { code: "ru", flag: "RU", name: "Русский" },
] as const;

export default function LangPicker() {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find(l => l.code === locale) ?? languages[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all text-xs"
      >
        <Globe className="w-3.5 h-3.5 text-cartoon-blue dark:text-cartoon-blue" />
        <ReactCountryFlag countryCode={current.flag} svg style={{ width: "1.1em", height: "1.1em" }} className="rounded-sm" />
        <span className="hidden xs:inline text-xs font-medium text-gray-900 dark:text-white">{current.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-56 overflow-y-auto scrollbar-thin">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code as any); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition ${
                locale === lang.code ? "bg-cartoon-blue/10 text-cartoon-blue" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ReactCountryFlag countryCode={lang.flag} svg style={{ width: "1.3em", height: "1.3em" }} className="rounded-sm" />
              <span className="font-medium text-gray-900 dark:text-white">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}