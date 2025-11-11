import { useLocale, t } from "@/hooks/useLocale";

export default function SupportNote() {
  const [locale] = useLocale();
  const i18n = t(locale);
  const parts = i18n.supportNote.split("\n");

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3 shadow-md mb-5 text-xs sm:text-sm">
      <p className="font-bold text-orange-800 text-center leading-tight space-y-0.5">
        <span className="block text-green-600">{parts[0]}</span>
        <span className="block text-cartoon-blue dark:text-cartoon-blue">{parts[1]}</span>
        <span className="block text-gray-700 dark:text-gray-300">{parts[2]}</span>
        <span className="block text-orange-500">{parts[3]}</span>
      </p>
    </div>
  );
}