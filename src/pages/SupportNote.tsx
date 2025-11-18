// components/SupportNote.tsx

import { useState } from "react";
import { useLocale, t } from "@/hooks/useLocale";

export default function SupportNote() {
  const [locale] = useLocale();
  const i18n = t(locale);

  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      {/* Guide Button */}
      <div className="flex flex-col items-center mt-4">
        <button
          onClick={() => setShowGuide(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow transition"
        >
          {i18n.howToGuide}
        </button>
      </div>

      {/* Modal Guide */}
      {showGuide && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-xl max-w-xs w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold z-10 flex items-center justify-center shadow-md"
            >
              X
            </button>

            {/* Guide Image */}
            <img
              src="/images/guide.png"
              alt="Step-by-Step Guide"
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Support Note (formatted translation) */}
      <div className="mx-4 mt-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-lg shadow-amber-500/10 p-5">
          <p className="text-center text-sm lg:text-base leading-relaxed text-amber-800 font-medium">
            <span
              dangerouslySetInnerHTML={{
                __html: i18n.supportNote
                  // Replace Heart with styled Heart pulse
                  .replace(/Heart/g, `<span class="text-red-500 font-bold animate-pulse">Heart</span>`)
                  // Style <span> tags inside translation
                  .replace(
                    /<span>/g,
                    '<span class="inline-block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-bold">'
                  )
                  .replace(/<\/span>/g, "</span>")
              }}
            />
          </p>

          {/* Local CSS animations */}
          <style jsx>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
