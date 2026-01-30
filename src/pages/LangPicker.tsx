'use client';

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "@/hooks/useLocale";

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

export default function LangPicker() {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === locale) ?? languages[0];

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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-white border-[3px] border-cartoon-purple shadow-cartoon-purple
          hover:scale-105 active:scale-95 transition-all
          text-xs font-black text-gray-800 uppercase font-cartoon
        "
      >
        <ReactCountryFlag
          countryCode={current.flag}
          svg
          className="w-4 h-4 rounded-sm"
          style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))' }}
        />
        <span className="hidden sm:inline tracking-tight">{current.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-cartoon-purple transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={4}
        />
      </button>

      {open && (
        <div className="
          absolute top-full mt-3 right-0 w-44
          bg-white rounded-[1.5rem] shadow-cartoon-purple border-[4px] border-cartoon-purple
          overflow-hidden z-[110] animate-in zoom-in-95 duration-200
        ">
          <div className="p-2 space-y-1 max-h-72 overflow-y-auto scrollbar-hide">
            {languages.map((lang) => {
              const active = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-left text-xs transition-all font-black uppercase font-cartoon
                    ${active 
                      ? "bg-cartoon-purple text-white" 
                      : "text-gray-600 hover:bg-cartoon-cream hover:text-cartoon-purple"
                    }
                  `}
                >
                  <ReactCountryFlag
                    countryCode={lang.flag}
                    svg
                    className="w-5 h-5 rounded shadow-sm"
                  />
                  <span className="flex-1 tracking-tighter">{lang.name}</span>
                  {active && <Check className="w-4 h-4" strokeWidth={4} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
