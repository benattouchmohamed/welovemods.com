import { useState } from "react";
import { useLocale, t } from "@/hooks/useLocale";

export default function SupportNote() {
  const [locale] = useLocale();
  const i18n = t(locale);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center">

        <button
          onClick={() => setShowGuide(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 flex items-center gap-2"
        >
          {i18n.howToGuide}
        </button>

        <br />
      </div>

      {showGuide && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-xl max-w-xs w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold z-10 flex items-center justify-center shadow-md"
            >
              X
            </button>
            <img
              src="/images/guide.png"
              alt="Step-by-Step Guide"
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}