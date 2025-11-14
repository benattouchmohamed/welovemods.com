import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "@/hooks/useLocale";

// -----------------------------
// Languages list
// -----------------------------
const languages = [
  { code: "en", flag: "US", name: "English" },
  { code: "de", flag: "DE", name: "Deutsch" },
  { code: "es", flag: "ES", name: "Español" },
  { code: "pt", flag: "BR", name: "Português" },
  { code: "fr", flag: "FR", name: "Français" },
  { code: "ar", flag: "SA", name: "العربية" },
    { code: "tr", flag: "TR", name: "Türkçe" }, 
  { code: "ko", flag: "KR", name: "한국어" },
    { code: "it", flag: "IT", name: "Italiano" },
  { code: "ja", flag: "JP", name: "日本語" },
  { code: "ru", flag: "RU", name: "Русский" },
  { code: "zh", flag: "CN", name: "中文" },
  { code: "hi", flag: "IN", name: "हिंदी" },


] as const;

// -----------------------------
// Country → language mapping
// -----------------------------
const countryToLang: Record<string, string> = {
  // English
  US: "en", GB: "en", CA: "en", AU: "en", NZ: "en", IE: "en",
  // Spanish
  MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es", EC: "es",
  BO: "es", UY: "es", PY: "es", CR: "es", PA: "es", HN: "es",
  GT: "es", SV: "es", NI: "es", DO: "es", CU: "es", ES: "es",
  // Portuguese
  BR: "pt", PT: "pt",
  // French
  FR: "fr", BE: "fr", CH: "fr", LU: "fr",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", DZ: "ar", MA: "ar", TN: "ar",
  QA: "ar", KW: "ar", LB: "ar", OM: "ar", JO: "ar", BH: "ar",
  LY: "ar", SD: "ar", IQ: "ar", YE: "ar", SY: "ar",
  // German
  DE: "de", AT: "de", CH_DE: "de",
  // Russian
  RU: "ru", BY: "ru", KZ: "ru",
  // Japanese
  JP: "ja",
  // Korean
  KR: "ko",
  // Chinese
  CN: "zh", TW: "zh", HK: "zh",
  // Hindi
  IN: "hi",
  // Italian
  IT: "it", CH_IT: "it",
  // Turkish
  TR: "tr", // ← NEW
};

// -----------------------------
// Language Picker Component
// -----------------------------
export default function LangPicker() {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === locale) ?? languages[0];

  // Auto detect language
  useEffect(() => {
    const alreadyChosen = localStorage.getItem("lang_set_by_user");
    if (alreadyChosen) return;

    const detectLang = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const country = data.country_code?.toUpperCase();
        let autoLang = "en";

        if (country && countryToLang[country]) {
          autoLang = countryToLang[country];
        } else {
          const browserLang = navigator.language?.slice(0, 2).toLowerCase();
          const supported = languages.some((l) => l.code === browserLang);
          if (supported) autoLang = browserLang;
        }

        setLocale(autoLang as any);
      } catch {
        setLocale("en");
      }
    };

    detectLang();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handleSelect = (code: string) => {
    localStorage.setItem("lang_set_by_user", "1");
    setLocale(code as any);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative z-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 px-3.5 py-1.5 rounded-full
          bg-white border border-gray-300 shadow-sm
          hover:shadow transition-shadow duration-200
          text-xs font-medium text-gray-800
        "
      >
        <Globe className="w-3.5 h-3.5 text-purple-600" />
        <ReactCountryFlag
          countryCode={current.flag}
          svg
          className="w-4 h-4 rounded-sm"
        />
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="
          absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48
          bg-white rounded-xl shadow-xl border border-gray-200
          overflow-hidden z-50
        ">
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {languages.map((lang) => {
              const active = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                    text-left text-xs transition font-medium
                    ${active ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"}
                  `}
                >
                  <ReactCountryFlag
                    countryCode={lang.flag}
                    svg
                    className="w-5 h-5 rounded"
                  />
                  <span className="flex-1">{lang.name}</span>
                  {active && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
