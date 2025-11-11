// src/locales/index.ts
export type Locale = "en" | "es" | "ko" | "ja" | "ar" | "fr" | "ru";

interface TranslationFunctions {
  // Core
  unlock: string;
  completeOffer: (n: number) => string;
  oneOffer: string;
  toGetTheGame: string;
  downloadStarts: string;
  offersCompleted: (done: number, total: number) => string;
  howToGuide: string;
  appDownloadTip: string;
  downloadNow: string;
  completeOfferBtn: string;
  recommended: string;
  topSite: string;
  autoRedirect: string;
  mostUsers: (time: string) => string;
  language: string;
  error: string;
  supportNote: string;

  // Notifications
  playerFrom: string;
  unlocked: string;
  usersOnline: string;

  // Fallbacks & UX
  tryServer2?: string;
  tryOffers?: string;
  noOffers?: string;
  confirmExit?: string;
}

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    unlock: "Unlock",
    completeOffer: (n) => `Complete ${n} offer`,
    oneOffer: "1 offer",
    toGetTheGame: "to get the game.",
    downloadStarts: "Download starts automatically!",
    offersCompleted: (done, total) => `${done} / ${total} offer completed`,
    howToGuide: "How-to Guide",
    appDownloadTip: "Try offers of downloading apps – it’s so easy and 100% faster!",
    downloadNow: "Download Now",
    completeOfferBtn: "Complete Offer",
    recommended: "Recommended",
    topSite: "Top 1 site for most games in the world",
    autoRedirect: "auto-redirect & download!",
    mostUsers: (time) => `Most users get their game in ${time}!`,
    language: "Language",
    error: "Failed to load offers. Try the link below.",
    supportNote:
      "100% FREE • NOT A VIRUS\nJust follow the steps. Thanks!",

    playerFrom: "Player from",
    unlocked: "unlocked",
    usersOnline: "users online",

    tryServer2: "Try server 2 (if this doesn't work)",
    tryOffers: "Try Offers Here",
    noOffers: "No offers available at the moment.",
    confirmExit: "Are you sure you want to leave? Your progress may be lost.",
  },

  es: {
    unlock: "Desbloquea",
    completeOffer: (n) => `Completa ${n} oferta`,
    oneOffer: "1 oferta",
    toGetTheGame: "para obtener el juego.",
    downloadStarts: "¡La descarga comienza automáticamente!",
    offersCompleted: (done, total) => `${done} / ${total} oferta completada`,
    howToGuide: "Guía paso a paso",
    appDownloadTip:
      "Prueba ofertas de descargar apps – ¡es súper fácil y 100% más rápido!",
    downloadNow: "Descargar ahora",
    completeOfferBtn: "Completar oferta",
    recommended: "Recomendado",
    topSite: "Sitio #1 para la mayoría de los juegos del mundo",
    autoRedirect: "¡redirección automática y descarga!",
    mostUsers: (time) =>
      `¡La mayoría de usuarios obtienen su juego en ${time}!`,
    language: "Idioma",
    error: "No se pudieron cargar las ofertas. Prueba el enlace de abajo.",
    supportNote:
      "100% GRATIS • NO ES UN VIRUS\nSolo sigue los pasos. ¡Gracias!",

    playerFrom: "Jugador de",
    unlocked: "desbloqueó",
    usersOnline: "usuarios en línea",

    tryServer2: "Prueba el servidor 2 (si esto no funciona)",
    tryOffers: "Prueba las ofertas aquí",
    noOffers:  "No hay ofertas disponibles en este momento.",
    confirmExit: "¿Estás seguro de que quieres salir? Podrías perder tu progreso.",
  },

  ko: {
    unlock: "잠금 해제",
    completeOffer: (n) => `${n}개 오퍼 완료`,
    oneOffer: "1개 오퍼",
    toGetTheGame: "게임을 받으세요.",
    downloadStarts: "다운로드가 자동으로 시작됩니다!",
    offersCompleted: (done, total) => `${done} / ${total} 오퍼 완료`,
    howToGuide: "사용 방법 안내",
    appDownloadTip:
      "앱 다운로드 오퍼를 시도하세요 – 정말 쉽고 100% 빠릅니다!",
    downloadNow: "지금 다운로드",
    completeOfferBtn: "오퍼 완료",
    recommended: "추천",
    topSite: "세계 대부분의 게임을 위한 1위 사이트",
    autoRedirect: "자동 리다이렉트 & 다운로드!",
    mostUsers: (time) =>
      `대부분의 사용자는 ${time} 안에 게임을 받습니다!`,
    language: "언어",
    error: "오퍼를 불러오지 못했습니다. 아래 링크를 시도하세요.",
    supportNote:
      "100% 무료 • 바이러스 아님\n단계만 따라주세요. 감사합니다!",

    playerFrom: "플레이어",
    unlocked: "잠금 해제",
    usersOnline: "명 온라인",

    tryServer2: "서버 2 시도 (이게 안 되면)",
    tryOffers: "여기서 오퍼 시도",
    noOffers: "현재 사용 가능한 오퍼가 없습니다.",
    confirmExit: "정말 나가시겠습니까? 진행 상황이 손실될 수 있습니다.",
  },

  ja: {
    unlock: "アンロック",
    completeOffer: (n) => `${n}件のオファーを完了`,
    oneOffer: "1件のオファー",
    toGetTheGame: "ゲームを手に入れる。",
    downloadStarts: "ダウンロードが自動的に開始されます！",
    offersCompleted: (done, total) => `${done} / ${total} 오퍼 완료`,
    howToGuide: "使い方ガイド",
    appDownloadTip:
      "アプリダウンロードのオファーを試してみてください – とても簡単で100%高速です！",
    downloadNow: "今すぐダウンロード",
    completeOfferBtn: "オファーを完了",
    recommended: "おすすめ",
    topSite: "世界中のほとんどのゲームで1位のサイト",
    autoRedirect: "自動リダイレクト＆ダウンロード！",
    mostUsers: (time) =>
      `ほとんどのユーザーは${time}でゲームを入手！`,
    language: "言語",
    error: "オファーの読み込みに失敗しました。下のリンクをお試しください。",
    supportNote:
      "100%無料 • ウイルスではありません\n手順に従うだけ。ありがとう！",

    playerFrom: "プレイヤー",
    unlocked: "アンロック",
    usersOnline: "人がオンライン",

    tryServer2: "サーバー2を試す（これがダメなら）",
    tryOffers: "ここでオファーを試す",
    noOffers: "現在オファーはありません。",
    confirmExit: "本当に終了しますか？進行状況が失われる可能性があります。",
  },

  ar: {
    unlock: "فتح",
    completeOffer: (n) => `أكمل ${n} عرضًا`,
    oneOffer: "عرض واحد",
    toGetTheGame: "لتحصل على اللعبة.",
    downloadStarts: "يبدأ التحميل تلقائيًا!",
    offersCompleted: (done, total) => `${done} / ${total} عرض مكتمل`,
    howToGuide: "دليل الاستخدام",
    appDownloadTip:
      "جرب عروض تحميل التطبيقات – إنها سهلة جدًا وأسرع 100%!",
    downloadNow: "تحميل الآن",
    completeOfferBtn: "إكمال العرض",
    recommended: "موصى به",
    topSite: "الموقع الأول لمعظم الألعاب في العالم",
    autoRedirect: "إعادة توجيه تلقائي وتحميل!",
    mostUsers: (time) =>
      `معظم المستخدمين يحصلون على لعبتهم خلال ${time}!`,
    language: "اللغة",
    error: "فشل تحميل العروض. جرب الرابط أدناه.",
    supportNote:
      "100% مجاني • ليس فيروسًا\nاتبع الخطوات فقط. شكرًا!",

    playerFrom: "لاعب من",
    unlocked: "فتح",
    usersOnline: "مستخدم متصل",

    tryServer2: "جرب السيرفر 2 (إذا لم يعمل)",
    tryOffers: "جرب العروض هنا",
    noOffers: "لا توجد عروض متاحة الآن.",
    confirmExit: "هل أنت متأكد من الخروج؟ قد تفقد تقدمك.",
  },

  fr: {
    unlock: "Débloquer",
    completeOffer: (n) => `Compléter ${n} offre`,
    oneOffer: "1 offre",
    toGetTheGame: "pour obtenir le jeu.",
    downloadStarts: "Le téléchargement démarre automatiquement !",
    offersCompleted: (done, total) => `${done} / ${total} offre terminée`,
    howToGuide: "Guide pas à pas",
    appDownloadTip:
      "Essayez les offres de téléchargement d’apps – c’est super simple et 100 % plus rapide !",
    downloadNow: "Télécharger maintenant",
    completeOfferBtn: "Terminer l’offre",
    recommended: "Recommandé",
    topSite: "Site n°1 pour la plupart des jeux dans le monde",
    autoRedirect: "redirection automatique & téléchargement !",
    mostUsers: (time) =>
      `La plupart des utilisateurs obtiennent leur jeu en ${time} !`,
    language: "Langue",
    error: "Échec du chargement des offres. Essayez le lien ci-dessous.",
    supportNote:
      "100% GRATUIT • PAS DE VIRUS\nSuivez simplement les étapes. Merci !",

    playerFrom: "Joueur de",
    unlocked: "a débloqué",
    usersOnline: "utilisateurs en ligne",

    tryServer2: "Essayez le serveur 2 (si ça ne marche pas)",
    tryOffers: "Essayez les offres ici",
    noOffers: "Aucune offre disponible pour le moment.",
    confirmExit: "Êtes-vous sûr de vouloir quitter ? Votre progression risque d’être perdue.",
  },

  ru: {
    unlock: "Разблокировать",
    completeOffer: (n) => `Выполнить ${n} предложение`,
    oneOffer: "1 предложение",
    toGetTheGame: "чтобы получить игру.",
    downloadStarts: "Скачивание начнётся автоматически!",
    offersCompleted: (done, total) => `${done} / ${total} предложение выполнено`,
    howToGuide: "Инструкция",
    appDownloadTip:
      "Попробуйте предложения по загрузке приложений – это очень просто и в 100 % быстрее!",
    downloadNow: "Скачать сейчас",
    completeOfferBtn: "Выполнить предложение",
    recommended: "Рекомендуется",
    topSite: "Сайт №1 для большинства игр в мире",
    autoRedirect: "автоматический переход и скачивание!",
    mostUsers: (time) =>
      `Большинство пользователей получают игру за ${time}!`,
    language: "Язык",
    error: "Не удалось загрузить предложения. Попробуйте ссылку ниже.",
    supportNote:
      "100% БЕСПЛАТНО • НЕ ВИРУС\nПросто следуйте шагам. Спасибо!",

    playerFrom: "Игрок из",
    unlocked: "разблокировал",
    usersOnline: "пользователей онлайн",

    tryServer2: "Попробуйте сервер 2 (если не работает)",
    tryOffers: "Попробуйте предложения здесь",
    noOffers: "Нет доступных предложений.",
    confirmExit: "Вы уверены, что хотите уйти? Прогресс может быть потерян.",
  },
} as const;