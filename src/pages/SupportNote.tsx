// components/SupportNote.tsx
import { useState } from "react";
import { useLocale, t } from "@/hooks/useLocale";

export default function SupportNote() {
  const [locale] = useLocale();
  const i18n = t(locale);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      {/* Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="relative max-w-sm w-full bg-transparent overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGuide(false)}
              className="
                absolute top-4 right-4 z-10 flex items-center justify-center
                h-10 w-10 rounded-full bg-red-600 text-white text-2xl font-bold
                hover:bg-red-700 hover:scale-110 transition
              "
              aria-label="Close"
            >
              ×
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

      {/* Container WITHOUT background */}
      <div className="mx-4 mt-10">

        {/* Centered Guide Button ONLY */}
        <button
          onClick={() => setShowGuide(true)}
          className="
            mx-auto block
            px-4 py-2 rounded-lg
            text-blue-600 underline text-sm font-semibold
            transition hover:text-blue-700
          "
        >
          {i18n.howToGuide || "How to Guide"}
        </button>

        {/* Support Text */}
        <p
          className="
            text-center text-sm lg:text-base font-medium leading-relaxed
            text-amber-900 dark:text-amber-100 mt-4
          "
          dangerouslySetInnerHTML={{
            __html: (i18n.supportNote || "")
              .replace(
                /Heart/g,
                `<span class="inline-block text-red-600 text-xl animate-pulse">Heart</span>`
              )
              .replace(
                /<span>(.*?)<\/span>/g,
                `<span class="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">$1</span>`
              ),
          }}
        />
      </div>
    </>
  );
}
