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
  // recommended: string; → REMOVED
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
  // New: Modal
  unlockNow?: string;
}

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    unlock: "Unlock Game",
    completeOffer: (n) => `Complete ${n} quick task`,
    oneOffer: "1 task",
    toGetTheGame: "to download instantly.",
    downloadStarts: "Your download will begin automatically.",
    offersCompleted: (done, total) => `${done} / ${total} task completed`,
    howToGuide: "Step-by-Step Guide",
    appDownloadTip: "Install & open any app for 30 seconds – fast and secure.",
    downloadNow: "Start Download",
    completeOfferBtn: "Complete Task",

    topSite: "Trusted by millions of gamers worldwide",
    autoRedirect: "instant download after task",
    mostUsers: (time) => `Most users download in under ${time}`,
    language: "Language",
    error: "Failed to load task. Please try the mirror link below.",
    supportNote:
      "100% Free • Verified Safe • No Surveys\n" +
      "Complete 1 quick app install (30s) to prove you're human.\n" +
      "We keep it fast, simple, and secure.",

    playerFrom: "Player from",
    unlocked: "unlocked",
    usersOnline: "users active",

    tryServer2: "Try server 2 (if this doesn’t work)",
    tryOffers: "Complete Task Here",
    noOffers: "No tasks available at the moment.",
    confirmExit: "Leave now? Your progress will be lost.",
    unlockNow: "Unlock Now",
  },

  es: {
    unlock: "Desbloquear Juego",
    completeOffer: (n) => `Completa ${n} tarea rápida`,
    oneOffer: "1 tarea",
    toGetTheGame: "para descargar al instante.",
    downloadStarts: "La descarga comenzará automáticamente.",
    offersCompleted: (done, total) => `${done} / ${total} tarea completada`,
    howToGuide: "Guía paso a paso",
    appDownloadTip: "Instala y abre cualquier app por 30 segundos – rápido y seguro.",
    downloadNow: "Iniciar Descarga",
    completeOfferBtn: "Completar Tarea",

    topSite: "Confiable para millones de jugadores en todo el mundo",
    autoRedirect: "descarga instantánea tras tarea",
    mostUsers: (time) => `La mayoría descarga en menos de ${time}`,
    language: "Idioma",
    error: "Error al cargar tarea. Prueba el enlace espejo abajo.",
    supportNote:
      "100% Gratis • Verificado Seguro • Sin Encuestas\n" +
      "Completa 1 instalación rápida (30s) para verificar que eres humano.\n" +
      "Rápido, simple y seguro.",

    playerFrom: "Jugador de",
    unlocked: "desbloqueó",
    usersOnline: "usuarios activos",

    tryServer2: "Prueba el servidor 2 (si no funciona)",
    tryOffers: "Completar Tarea Aquí",
    noOffers: "No hay tareas disponibles ahora.",
    confirmExit: "¿Salir ahora? Perderás tu progreso.",
    unlockNow: "Desbloquear Ahora",
  },

  ko: {
    unlock: "게임 잠금 해제",
    completeOffer: (n) => `${n}개 빠른 작업 완료`,
    oneOffer: "1개 작업",
    toGetTheGame: "즉시 다운로드.",
    downloadStarts: "다운로드가 자동으로 시작됩니다.",
    offersCompleted: (done, total) => `${done} / ${total} 작업 완료`,
    howToGuide: "단계별 안내",
    appDownloadTip: "앱 설치 후 30초 실행 – 빠르고 안전합니다.",
    downloadNow: "다운로드 시작",
    completeOfferBtn: "작업 완료",

    topSite: "전 세계 수백만 게이머가 신뢰",
    autoRedirect: "작업 후 즉시 다운로드",
    mostUsers: (time) => `대부분 ${time} 이내 다운로드`,
    language: "언어",
    error: "작업 로드 실패. 아래 미러 링크를 시도하세요.",
    supportNote:
      "100% 무료 • 검증된 안전 • 설문 없음\n" +
      "1개 빠른 앱 설치(30초)로 인간 확인.\n" +
      "빠르고 간단하며 안전합니다.",

    playerFrom: "플레이어",
    unlocked: "잠금 해제",
    usersOnline: "명 온라인",

    tryServer2: "서버 2 시도 (안 되면)",
    tryOffers: "여기서 작업 완료",
    noOffers: "현재 작업 없음",
    confirmExit: "지금 나가면 진행 상황이 사라집니다.",
    unlockNow: "지금 잠금 해제",
  },

  ja: {
    unlock: "ゲームをアンロック",
    completeOffer: (n) => `${n}件の簡単タスクを完了`,
    oneOffer: "1件のタスク",
    toGetTheGame: "即時ダウンロード。",
    downloadStarts: "ダウンロードが自動的に開始されます。",
    offersCompleted: (done, total) => `${done} / ${total} タスク完了`,
    howToGuide: "ステップバイステップガイド",
    appDownloadTip: "アプリをインストール後30秒実行 – 高速かつ安全。",
    downloadNow: "ダウンロード開始",
    completeOfferBtn: "タスクを完了",

    topSite: "世界中の数百万ゲーマーから信頼",
    autoRedirect: "タスク後即時ダウンロード",
    mostUsers: (time) => `ほとんどのユーザーが${time}以内で入手`,
    language: "言語",
    error: "タスク読み込み失敗。以下のミラーリンクをお試しください。",
    supportNote:
      "100%無料 • 検証済み安全 • アンケートなし\n" +
      "1件の簡単アプリインストール（30秒）で人間確認。\n" +
      "高速・シンプル・安全。",

    playerFrom: "プレイヤー",
    unlocked: "アンロック",
    usersOnline: "人がオンライン",

    tryServer2: "サーバー2を試す（これがダメなら）",
    tryOffers: "ここでタスクを完了",
    noOffers: "現在タスクはありません",
    confirmExit: "今終了しますか？進行状況が失われます。",
    unlockNow: "今すぐアンロック",
  },

  ar: {
    unlock: "فتح اللعبة",
    completeOffer: (n) => `أكمل ${n} مهمة سريعة`,
    oneOffer: "مهمة واحدة",
    toGetTheGame: "للتحميل فوراً.",
    downloadStarts: "سيبدأ التحميل تلقائيًا.",
    offersCompleted: (done, total) => `${done} / ${total} مهمة مكتملة`,
    howToGuide: "دليل خطوة بخطوة",
    appDownloadTip: "قم بتثبيت وتشغيل أي تطبيق لمدة 30 ثانية – سريع وآمن.",
    downloadNow: "ابدأ التحميل",
    completeOfferBtn: "إكمال المهمة",

    topSite: "موثوق به من ملايين اللاعبين حول العالم",
    autoRedirect: "تحميل فوري بعد المهمة",
    mostUsers: (time) => `معظم المستخدمين يحملون في أقل من ${time}`,
    language: "اللغة",
    error: "فشل تحميل المهمة. جرب الرابط البديل أدناه.",
    supportNote:
      "100% مجاني • تم التحقق من الأمان • بدون استطلاعات\n" +
      "أكمل تثبيت تطبيق واحد (30 ثانية) لتأكيد أنك بشري.\n" +
      "سريع، بسيط، آمن.",

    playerFrom: "لاعب من",
    unlocked: "فتح",
    usersOnline: "مستخدم نشط",

    tryServer2: "جرب السيرفر 2 (إذا لم يعمل)",
    tryOffers: "أكمل المهمة هنا",
    noOffers: "لا توجد مهام متاحة الآن.",
    confirmExit: "الخروج الآن؟ سيتم فقدان التقدم.",
    unlockNow: "افتح الآن",
  },

  fr: {
    unlock: "Débloquer le Jeu",
    completeOffer: (n) => `Terminer ${n} tâche rapide`,
    oneOffer: "1 tâche",
    toGetTheGame: "pour télécharger instantanément.",
    downloadStarts: "Le téléchargement démarre automatiquement.",
    offersCompleted: (done, total) => `${done} / ${total} tâche terminée`,
    howToGuide: "Guide étape par étape",
    appDownloadTip: "Installez et ouvrez une app 30s – rapide et sécurisé.",
    downloadNow: "Lancer le Téléchargement",
    completeOfferBtn: "Terminer la Tâche",

    topSite: "Approuvé par des millions de joueurs dans le monde",
    autoRedirect: "téléchargement instantané après tâche",
    mostUsers: (time) => `La plupart téléchargent en moins de ${time}`,
    language: "Langue",
    error: "Échec du chargement. Essayez le lien miroir ci-dessous.",
    supportNote:
      "100% Gratuit • Vérifié Sûr • Sans Sondage\n" +
      "Terminez 1 installation rapide (30s) pour confirmer que vous êtes humain.\n" +
      "Rapide, simple, sécurisé.",

    playerFrom: "Joueur de",
    unlocked: "a débloqué",
    usersOnline: "utilisateurs en ligne",

    tryServer2: "Essayez le serveur 2 (si ça ne marche pas)",
    tryOffers: "Terminer la tâche ici",
    noOffers: "Aucune tâche disponible pour le moment.",
    confirmExit: "Quitter maintenant ? Votre progression sera perdue.",
    unlockNow: "Débloquer Maintenant",
  },

  ru: {
    unlock: "Разблокировать Игру",
    completeOffer: (n) => `Выполнить ${n} быстрое задание`,
    oneOffer: "1 задание",
    toGetTheGame: "для мгновенной загрузки.",
    downloadStarts: "Скачивание начнётся автоматически.",
    offersCompleted: (done, total) => `${done} / ${total} задание выполнено`,
    howToGuide: "Пошаговая инструкция",
    appDownloadTip: "Установите и откройте любое приложение на 30 сек – быстро и безопасно.",
    downloadNow: "Начать Скачивание",
    completeOfferBtn: "Выполнить Задание",

    topSite: "Доверено миллионам игроков по всему миру",
    autoRedirect: "мгновенная загрузка после задания",
    mostUsers: (time) => `Большинство скачивают за ${time}`,
    language: "Язык",
    error: "Не удалось загрузить. Попробуйте зеркальную ссылку ниже.",
    supportNote:
      "100% Бесплатно • Проверено Безопасно • Без Опросов\n" +
      "Выполните 1 быстрое задание (установка приложения, 30 сек).\n" +
      "Быстро, просто, безопасно.",

    playerFrom: "Игрок из",
    unlocked: "разблокировал",
    usersOnline: "пользователей онлайн",

    tryServer2: "Попробуйте сервер 2 (если не работает)",
    tryOffers: "Выполнить задание здесь",
    noOffers: "Нет доступных заданий.",
    confirmExit: "Выйти? Прогресс будет потерян.",
    unlockNow: "Разблокировать Сейчас",
  },
} as const;