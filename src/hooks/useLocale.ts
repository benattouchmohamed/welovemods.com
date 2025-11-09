// src/hooks/useLocale.ts
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Locale, translations } from "@/locales";

const SUPPORTED: Locale[] = ["en", "es", "ko", "ja", "ar", "fr", "ru"];

export const useLocale = (): [Locale, (l: Locale) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlLang = searchParams.get("lang") as Locale | null;

  const persisted = localStorage.getItem("lang") as Locale | null;
  const browser = (navigator.language.split("-")[0] as Locale) || "en";

  const initial = SUPPORTED.includes(urlLang!)
    ? urlLang!
    : SUPPORTED.includes(persisted!)
    ? persisted!
    : SUPPORTED.includes(browser)
    ? browser
    : "en";

  const [locale, setLocaleState] = useState<Locale>(initial);

  // Sync URL ↔ state
  useEffect(() => {
    if (urlLang && urlLang !== locale) {
      setLocaleState(urlLang);
      localStorage.setItem("lang", urlLang);
    } else if (!urlLang && locale !== initial) {
      setSearchParams((p) => {
        p.set("lang", locale);
        return p;
      });
      localStorage.setItem("lang", locale);
    }
  }, [urlLang, locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("lang", l);
    setSearchParams((p) => {
      p.set("lang", l);
      return p;
    });
  };

  return [locale, setLocale];
};

export const t = (locale: Locale) => translations[locale];