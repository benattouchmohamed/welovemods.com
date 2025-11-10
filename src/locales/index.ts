// src/locales/index.ts
export type Locale = "en" | "es" | "ko" | "ja" | "ar" | "fr" | "ru";

type Translations = typeof translations.en;

export const translations = {
  en: {
    unlock: "Unlock",
    completeOffer: (n: number) => `Complete ${n} offer`,
    toGetTheGame: "to get the game.",
    downloadStarts: "Download starts automatically!",
    offersCompleted: (done: number, total: number) => `${done} / ${total} offer completed`,
    howToGuide: "How-to Guide",
    appDownloadTip:
      "Try offers of downloading apps – it’s so easy and 100% faster!",
    downloadNow: "Download Now",
    completeOfferBtn: "Complete Offer",
    recommended: "Recommended",
    topSite: "Top 1 site for most games in the world",
    autoRedirect: "auto-redirect & download!",
    mostUsers: (time: string) => `Most users get their game in ${time}!`,
    language: "Language",
    error: "Failed to load offers. Try the link below.",

    // ← NEW KEY
    supportNote:
      "100% FREE • NOT A VIRUS\nYou help me with 0.2$ per offer → You get the game!\nJust follow the steps. Thanks!",
  },

  es: {
    unlock: "Desbloquea",
    completeOffer: (n: number) => `Completa ${n} oferta`,
    toGetTheGame: "para obtener el juego.",
    downloadStarts: "¡La descarga comienza automáticamente!",
    offersCompleted: (done: number, total: number) => `${done} / ${total} oferta completada`,
    howToGuide: "Guía paso a paso",
    appDownloadTip:
      "Prueba ofertas de descargar apps – ¡es súper fácil y 100% más rápido!",
    downloadNow: "Descargar ahora",
    completeOfferBtn: "Completar oferta",
    recommended: "Recomendado",
    topSite: "Sitio #1 para la mayoría de los juegos del mundo",
    autoRedirect: "¡redirección automática y descarga!",
    mostUsers: (time: string) => `¡La mayoría de usuarios obtienen su juego en ${time}!`,
    language: "Idioma",
    error: "No se pudieron cargar las ofertas. Prueba el enlace de abajo.",

    supportNote:
      "100% GRATIS • NO ES UN VIRUS\nMe ayudas con 0.2$ por oferta → ¡Tú obtienes el juego!\nSolo sigue los pasos. ¡Gracias!",
  },

  ko: {
    unlock: "잠금 해제",
    completeOffer: (n: number) => `${n}개 오퍼 완료`,
    toGetTheGame: "게임을 받으세요.",
    downloadStarts: "다운로드가 자동으로 시작됩니다!",
    offersCompleted: (done: number, total: number) => `${done} / ${total} 오퍼 완료`,
    howToGuide: "사용 방법 안내",
    appDownloadTip:
      "앱 다운로드 오퍼를 시도하세요 – 정말 쉽고 100% 빠릅니다!",
    downloadNow: "지금 다운로드",
    completeOfferBtn: "오퍼 완료",
    recommended: "추천",
    topSite: "세계 대부분의 게임을 위한 1위 사이트",
    autoRedirect: "자동 리다이렉트 & 다운로드!",
    mostUsers: (time: string) => `대부분의 사용자는 ${time} 안에 게임을 받습니다!`,
    language: "언어",
    error: "오퍼를 불러오지 못했습니다. 아래 링크를 시도하세요.",

    supportNote:
      "100% 무료 • 바이러스 아님\n오퍼당 0.2$ 도와주시면 → 게임을 받습니다!\n단계만 따라주세요. 감사합니다!",
  },

  ja: {
    unlock: "アンロック",
    completeOffer: (n: number) => `${n}件のオファーを完了`,
    toGetTheGame: "ゲームを手に入れる。",
    downloadStarts: "ダウンロードが自動的に開始されます！",
    offersCompleted: (done: number, total: number) => `${done} / ${total} オファー完了`,
    howToGuide: "使い方ガイド",
    appDownloadTip:
      "アプリダウンロードのオファーを試してみてください – とても簡単で100%高速です！",
    downloadNow: "今すぐダウンロード",
    completeOfferBtn: "オファーを完了",
    recommended: "おすすめ",
    topSite: "世界中のほとんどのゲームで1位のサイト",
    autoRedirect: "自動リダイレクト＆ダウンロード！",
    mostUsers: (time: string) => `ほとんどのユーザーは${time}でゲームを入手！`,
    language: "言語",
    error: "オファーの読み込みに失敗しました。下のリンクをお試しください。",

    supportNote:
      "100%無料 • ウイルスではありません\nオファー1件につき0.2$の支援 → ゲームをゲット！\n手順に従うだけ。ありがとう！",
  },

  ar: {
    unlock: "فتح",
    completeOffer: (n: number) => `أكمل ${n} عرضًا`,
    toGetTheGame: "لتحصل على اللعبة.",
    downloadStarts: "يبدأ التحميل تلقائيًا!",
    offersCompleted: (done: number, total: number) => `${done} / ${total} عرض مكتمل`,
    howToGuide: "دليل الاستخدام",
    appDownloadTip:
      "جرب عروض تحميل التطبيقات – إنها سهلة جدًا وأسرع 100%!",
    downloadNow: "تحميل الآن",
    completeOfferBtn: "إكمال العرض",
    recommended: "موصى به",
    topSite: "الموقع الأول لمعظم الألعاب في العالم",
    autoRedirect: "إعادة توجيه تلقائي وتحميل!",
    mostUsers: (time: string) => `معظم المستخدمين يحصلون على لعبتهم خلال ${time}!`,
    language: "اللغة",
    error: "فشل تحميل العروض. جرب الرابط أدناه.",

    supportNote:
      "100% مجاني • ليس فيروسًا\nتساعدني بـ 0.2$ لكل عرض → تحصل على اللعبة!\nاتبع الخطوات فقط. شكرًا!",
  },

  fr: {
    unlock: "Débloquer",
    completeOffer: (n: number) => `Compléter ${n} offre`,
    toGetTheGame: "pour obtenir le jeu.",
    downloadStarts: "Le téléchargement démarre automatiquement !",
    offersCompleted: (done: number, total: number) => `${done} / ${total} offre terminée`,
    howToGuide: "Guide pas à pas",
    appDownloadTip:
      "Essayez les offres de téléchargement d’apps – c’est super simple et 100 % plus rapide !",
    downloadNow: "Télécharger maintenant",
    completeOfferBtn: "Terminer l’offre",
    recommended: "Recommandé",
    topSite: "Site n°1 pour la plupart des jeux dans le monde",
    autoRedirect: "redirection automatique & téléchargement !",
    mostUsers: (time: string) => `La plupart des utilisateurs obtiennent leur jeu en ${time} !`,
    language: "Langue",
    error: "Échec du chargement des offres. Essayez le lien ci-dessous.",

    supportNote:
      "100% GRATUIT • PAS DE VIRUS\nVous m’aidez avec 0.2$ par offre → Vous obtenez le jeu !\nSuivez simplement les étapes. Merci !",
  },

  ru: {
    unlock: "Разблокировать",
    completeOffer: (n: number) => `Выполнить ${n} предложение`,
    toGetTheGame: "чтобы получить игру.",
    downloadStarts: "Скачивание начнётся автоматически!",
    offersCompleted: (done: number, total: number) => `${done} / ${total} предложение выполнено`,
    howToGuide: "Инструкция",
    appDownloadTip:
      "Попробуйте предложения по загрузке приложений – это очень просто и в 100 % быстрее!",
    downloadNow: "Скачать сейчас",
    completeOfferBtn: "Выполнить предложение",
    recommended: "Рекомендуется",
    topSite: "Сайт №1 для большинства игр в мире",
    autoRedirect: "автоматический переход и скачивание!",
    mostUsers: (time: string) => `Большинство пользователей получают игру за ${time}!`,
    language: "Язык",
    error: "Не удалось загрузить предложения. Попробуйте ссылку ниже.",

    supportNote:
      "100% БЕСПЛАТНО • НЕ ВИРУС\nВы помогаете мне 0.2$ за оффер → Вы получаете игру!\nПросто следуйте шагам. Спасибо!",
  },
} as const;

