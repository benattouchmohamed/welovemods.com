// import { useState } from "react";
// import { useLocale, t } from "@/hooks/useLocale";

// export default function SupportNote() {
//   const [locale] = useLocale();
//   const i18n = t(locale);
//   const [showGuide, setShowGuide] = useState(false);

//   return (
//     <>
//       <div className="flex flex-col items-center">

// <button
//   onClick={() => setShowGuide(true)}
//   className="bg-gradient-to-r from-emerald-500 to-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow transition"
// >
//   {i18n.howToGuide}
// </button>
//         <br />
//       </div>

//       {showGuide && (
//         <div
//           className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//           onClick={() => setShowGuide(false)}
//         >
//           <div
//             className="relative bg-white dark:bg-gray-800 rounded-xl max-w-xs w-full overflow-hidden shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setShowGuide(false)}
//               className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold z-10 flex items-center justify-center shadow-md"
//             >
//               X
//             </button>
//             <img
//               src="/images/guide.png"
//               alt="Step-by-Step Guide"
//               className="w-full"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// components/SupportNote.tsx
// components/SupportNote.tsx
// components/SupportNote.tsx

import { useLocale, t } from "@/hooks/useLocale";

export default function SupportNote() {
  const i18n = t(useLocale()[0]);

  return (
    <div className="mx-4 mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-lg shadow-amber-500/10 p-5">
        {/* Badge "Tip" élégant */}
     
        {/* Texte avec mise en valeur subtile mais pro de la partie <span> */}
        <p className="text-center text-sm lg:text-base leading-relaxed text-amber-800 font-medium">
          <span
            dangerouslySetInnerHTML={{
              __html: i18n.supportNote
                // Remplace Heart par un vrai cœur stylé
                .replace(/Heart/g, "Heart")
                .replace(/Heart/g, `<span class="text-red-500 font-bold animate-pulse">Heart</span>`)
                // Style appliqué uniquement aux <span> de la traduction
                .replace(/<span>/g, '<span class="inline-block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-bold">')
                .replace(/<\/span>/g, "</span>"),
            }}
          />
        </p>

        {/* Style discret et professionnel (sans fichier CSS externe) */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}</style>
      </div>
    </div>
  );
}