export type Locale = "en" | "es" | "ko" | "ja" | "ar" | "fr" | "ru" | "de";

interface TranslationFunctions {
  // Header & Verification
  completeOneTask: string;
  gameReady: string;
  onceFinishTask: string;
  downloadStarts: string;
  offersCompleted: (done: number, total: number) => string;
  howToGuide: string;

  // Offer & Modal
  completeOffer: (n: number) => string;
  oneOffer: string;
  toGetTheGame: string;
  appDownloadTip: string;
  downloadNow: string;
  completeOfferBtn: string;
  completeNow: string;

  // Notifications & UX
  topSite: string;
  autoRedirect: string;
  mostUsers: (time: string) => string;
  language: string;
  playerFrom: string;
  unlocked: string;
  usersOnline: string;

  // Errors & Fallbacks
  error: string;
  supportNote: string;
  tryServer2?: string;
  tryOffers?: string;
  noOffers?: string;
  confirmExit?: string;
}

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    completeOneTask: "Complete one task to prove you are not a bot",
    gameReady: "{game} is ready to download!",
    onceFinishTask: "Once you finish 1 task, your download will start automatically!",
    downloadStarts: "Your download will begin automatically.",
    offersCompleted: (done, total) => `${done} / ${total} task completed`,
    howToGuide: "Step-by-Step Guide",
    completeOffer: (n) => `Complete ${n} quick task`,
    oneOffer: "1 task",
    toGetTheGame: "to download instantly.",
    appDownloadTip: "Install & open any app for 30 seconds – fast and secure.",
    downloadNow: "Start Download",
    completeOfferBtn: "Complete Task",
    completeNow: "Complete Now",
    topSite: "Trusted by millions of gamers worldwide",
    autoRedirect: "instant download after task",
    mostUsers: (time) => `Most users download in under ${time}`,
    language: "Language",
    playerFrom: "Player from",
    unlocked: "download successfully",
    usersOnline: "users active",
    error: "Failed to load task. Please try the mirror link below.",
    supportNote:
      "100% Free • Verified Safe\n" +
      "Please read the task description to prove you're human successfully and get your game faster!\n" +
      "We keep it fast, simple, and secure.",
    tryServer2: "Try server 2 (if this doesn’t work)",
    tryOffers: "Complete Task Here",
    noOffers: "No tasks available at the moment.",
    confirmExit: "Leave now? Your progress will be lost.",
  },

  es: {
    completeOneTask: "Completa una tarea para demostrar que no eres un bot",
    gameReady: "¡{game} está listo para descargar!",
    onceFinishTask: "¡Una vez completes 1 tarea, la descarga comenzará automáticamente!",
    downloadStarts: "La descarga comenzará automáticamente.",
    offersCompleted: (done, total) => `${done} / ${total} tarea completada`,
    howToGuide: "Guía paso a paso",
    completeOffer: (n) => `Completa ${n} tarea rápida`,
    oneOffer: "1 tarea",
    toGetTheGame: "para descargar al instante.",
    appDownloadTip: "Instala y abre cualquier app por 30 segundos – rápido y seguro.",
    downloadNow: "Iniciar Descarga",
    completeOfferBtn: "Completar Tarea",
    completeNow: "Completar Ahora",
    topSite: "Confiable para millones de jugadores en todo el mundo",
    autoRedirect: "descarga instantánea tras tarea",
    mostUsers: (time) => `La mayoría descarga en menos de ${time}`,
    language: "Idioma",
    playerFrom: "Jugador de",
    unlocked: "descarga exitosa",
    usersOnline: "usuarios activos",
    error: "Error al cargar tarea. Prueba el enlace espejo abajo.",
    supportNote:
      "100% Gratis • Verificado Seguro\n" +
      "¡Por favor lee la descripción de la tarea para probar que eres humano y obtener tu juego más rápido!\n" +
      "Rápido, simple y seguro.",
    tryServer2: "Prueba el servidor 2 (si no funciona)",
    tryOffers: "Completar Tarea Aquí",
    noOffers: "No hay tareas disponibles ahora.",
    confirmExit: "¿Salir ahora? Perderás tu progreso.",
  },

  ko: {
    completeOneTask: "봇이 아님을 증명하기 위해 1개의 작업을 완료하세요",
    gameReady: "{game} 다운로드 준비 완료!",
    onceFinishTask: "1개의 작업을 마치면 다운로드가 자동으로 시작됩니다!",
    downloadStarts: "다운로드가 자동으로 시작됩니다.",
    offersCompleted: (done, total) => `${done} / ${total} 작업 완료`,
    howToGuide: "단계별 안내",
    completeOffer: (n) => `${n}개 빠른 작업 완료`,
    oneOffer: "1개 작업",
    toGetTheGame: "즉시 다운로드.",
    appDownloadTip: "앱 설치 후 30초 실행 – 빠르고 안전합니다.",
    downloadNow: "다운로드 시작",
    completeOfferBtn: "작업 완료",
    completeNow: "지금 완료",
    topSite: "전 세계 수백만 게이머가 신뢰",
    autoRedirect: "작업 후 즉시 다운로드",
    mostUsers: (time) => `대부분 ${time} 이내 다운로드`,
    language: "언어",
    playerFrom: "플레이어",
    unlocked: "다운로드 성공",
    usersOnline: "명 온라인",
    error: "작업 로드 실패. 아래 미러 링크를 시도하세요.",
    supportNote:
      "100% 무료 • 검증된 안전\n" +
      "작업 설명을 잘 읽고 인간임을 증명하면 게임을 더 빨리 받을 수 있습니다!\n" +
      "빠르고 간단하며 안전합니다.",
    tryServer2: "서버 2 시도 (안 되면)",
    tryOffers: "여기서 작업 완료",
    noOffers: "현재 작업 없음",
    confirmExit: "지금 나가면 진행 상황이 사라집니다.",
  },

  ja: {
    completeOneTask: "ボットでないことを証明するため 1 つのタスクを完了してください",
    gameReady: "{game} がダウンロード可能です！",
    onceFinishTask: "1 つのタスクを完了すると、ダウンロードが自動的に開始されます！",
    downloadStarts: "ダウンロードが自動的に開始されます。",
    offersCompleted: (done, total) => `${done} / ${total} タスク完了`,
    howToGuide: "ステップバイステップガイド",
    completeOffer: (n) => `${n}件の簡単タスクを完了`,
    oneOffer: "1件のタスク",
    toGetTheGame: "即時ダウンロード。",
    appDownloadTip: "アプリをインストール後30秒実行 – 高速かつ安全。",
    downloadNow: "ダウンロード開始",
    completeOfferBtn: "タスクを完了",
    completeNow: "今すぐ完了",
    topSite: "世界中の数百万ゲーマーから信頼",
    autoRedirect: "タスク後即時ダウンロード",
    mostUsers: (time) => `ほとんどのユーザーが${time}以内で入手`,
    language: "言語",
    playerFrom: "プレイヤー",
    unlocked: "ダウンロード成功",
    usersOnline: "人がオンライン",
    error: "タスク読み込み失敗。以下のミラーリンクをお試しください。",
    supportNote:
      "100%無料 • 検証済み安全\n" +
      "タスクの説明をよく読んで人間であることを証明し、ゲームをより早く入手しましょう！\n" +
      "高速・シンプル・安全。",
    tryServer2: "サーバー2を試す（これがダメなら）",
    tryOffers: "ここでタスクを完了",
    noOffers: "現在タスクはありません",
    confirmExit: "今終了しますか？進行状況が失われます。",
  },

  ar: {
    completeOneTask: "أكمل مهمة واحدة لإثبات أنك لست روبوت",
    gameReady: "{game} جاهز للتحميل!",
    onceFinishTask: "بمجرد إكمال مهمة واحدة، سيبدأ التحميل تلقائيًا!",
    downloadStarts: "سيبدأ التحميل تلقائيًا.",
    offersCompleted: (done, total) => `${done} / ${total} مهمة مكتملة`,
    howToGuide: "دليل خطوة بخطوة",
    completeOffer: (n) => `أكمل ${n} مهمة سريعة`,
    oneOffer: "مهمة واحدة",
    toGetTheGame: "للتحميل فوراً.",
    appDownloadTip: "قم بتثبيت وتشغيل أي تطبيق لمدة 30 ثانية – سريع وآمن.",
    downloadNow: "ابدأ التحميل",
    completeOfferBtn: "إكمال المهمة",
    completeNow: "أكمل الآن",
    topSite: "موثوق به من ملايين اللاعبين حول العالم",
    autoRedirect: "تحميل فوري بعد المهمة",
    mostUsers: (time) => `معظم المستخدمين يحملون في أقل من ${time}`,
    language: "اللغة",
    playerFrom: "لاعب من",
    unlocked: "تحميل بنجاح",
    usersOnline: "مستخدم نشط",
    error: "فشل تحميل المهمة. جرب الرابط البديل أدناه.",
    supportNote:
      "100% مجاني • تم التحقق من الأمان\n" +
      "يرجى قراءة وصف المهمة لإثبات أنك بشري بنجاح والحصول على لعبتك أسرع!\n" +
      "سريع، بسيط، آمن.",
    tryServer2: "جرب السيرفر 2 (إذا لم يعمل)",
    tryOffers: "أكمل المهمة هنا",
    noOffers: "لا توجد مهام متاحة الآن.",
    confirmExit: "الخروج الآن؟ سيتم فقدان التقدم.",
  },

  fr: {
    completeOneTask: "Terminez une tâche pour prouver que vous n’êtes pas un robot",
    gameReady: "{game} est prêt à être téléchargé !",
    onceFinishTask: "Dès que vous terminez 1 tâche, le téléchargement démarre automatiquement !",
    downloadStarts: "Le téléchargement démarre automatiquement.",
    offersCompleted: (done, total) => `${done} / ${total} tâche terminée`,
    howToGuide: "Guide étape par étape",
    completeOffer: (n) => `Terminer ${n} tâche rapide`,
    oneOffer: "1 tâche",
    toGetTheGame: "pour télécharger instantanément.",
    appDownloadTip: "Installez et ouvrez une app 30s – rapide et sécurisé.",
    downloadNow: "Lancer le Téléchargement",
    completeOfferBtn: "Terminer la Tâche",
    completeNow: "Terminer Maintenant",
    topSite: "Approuvé par des millions de joueurs dans le monde",
    autoRedirect: "téléchargement instantané après tâche",
    mostUsers: (time) => `La plupart téléchargent en moins de ${time}`,
    language: "Langue",
    playerFrom: "Joueur de",
    unlocked: "téléchargement réussi",
    usersOnline: "utilisateurs en ligne",
    error: "Échec du chargement. Essayez le lien miroir ci-dessous.",
    supportNote:
      "100% Gratuit • Vérifié Sûr\n" +
      "Veuillez lire la description de la tâche pour prouver que vous êtes humain et obtenir votre jeu plus vite !\n" +
      "Rapide, simple, sécurisé.",
    tryServer2: "Essayez le serveur 2 (si ça ne marche pas)",
    tryOffers: "Terminer la tâche ici",
    noOffers: "Aucune tâche disponible pour le moment.",
    confirmExit: "Quitter maintenant ? Votre progression sera perdue.",
  },

  ru: {
    completeOneTask: "Выполните одно задание, чтобы доказать, что вы не бот",
    gameReady: "{game} готов к загрузке!",
    onceFinishTask: "Как только вы завершите 1 задание, загрузка начнётся автоматически!",
    downloadStarts: "Скачивание начнётся автоматически.",
    offersCompleted: (done, total) => `${done} / ${total} задание выполнено`,
    howToGuide: "Пошаговая инструкция",
    completeOffer: (n) => `Выполнить ${n} быстрое задание`,
    oneOffer: "1 задание",
    toGetTheGame: "для мгновенной загрузки.",
    appDownloadTip: "Установите и откройте любое приложение на 30 сек – быстро и безопасно.",
    downloadNow: "Начать Скачивание",
    completeOfferBtn: "Выполнить Задание",
    completeNow: "Завершить Сейчас",
    topSite: "Доверено миллионам игроков по всему миру",
    autoRedirect: "мгновенная загрузка после задания",
    mostUsers: (time) => `Большинство скачивают за ${time}`,
    language: "Язык",
    playerFrom: "Игрок из",
    unlocked: "скачал успешно",
    usersOnline: "пользователей онлайн",
    error: "Не удалось загрузить. Попробуйте зеркальную ссылку ниже.",
    supportNote:
      "100% Бесплатно • Проверено Безопасно\n" +
      "Пожалуйста, внимательно прочитайте описание задания, чтобы доказать, что вы человек, и получить игру быстрее!\n" +
      "Быстро, просто, безопасно.",
    tryServer2: "Попробуйте сервер 2 (если не работает)",
    tryOffers: "Выполнить задание здесь",
    noOffers: "Нет доступных заданий.",
    confirmExit: "Выйти? Прогресс будет потерян.",
  },

  /* GERMAN TRANSLATION */
  de: {
    completeOneTask: "Erledige eine Aufgabe, um zu beweisen, dass du kein Bot bist",
    gameReady: "{game} ist bereit zum Download!",
    onceFinishTask: "Sobald du 1 Aufgabe erledigst, startet der Download automatisch!",
    downloadStarts: "Dein Download beginnt automatisch.",
    offersCompleted: (done, total) => `${done} / ${total} Aufgabe erledigt`,
    howToGuide: "Schritt-für-Schritt-Anleitung",
    completeOffer: (n) => `${n} schnelle Aufgabe erledigen`,
    oneOffer: "1 Aufgabe",
    toGetTheGame: "um sofort herunterzuladen.",
    appDownloadTip: "Installiere & öffne eine App für 30 Sekunden – schnell und sicher.",
    downloadNow: "Download starten",
    completeOfferBtn: "Aufgabe erledigen",
    completeNow: "Jetzt erledigen",
    topSite: "Von Millionen Gamern weltweit vertraut",
    autoRedirect: "sofortiger Download nach Aufgabe",
    mostUsers: (time) => `Die meisten laden in unter ${time} herunter`,
    language: "Sprache",
    playerFrom: "Spieler aus",
    unlocked: "erfolgreich heruntergeladen",
    usersOnline: "Nutzer aktiv",
    error: "Aufgabe konnte nicht geladen werden. Probiere den Mirror-Link unten.",
    supportNote:
      "100% Kostenlos • Verifiziert Sicher\n" +
      "Bitte lies die Aufgabenbeschreibung, um zu beweisen, dass du ein Mensch bist und dein Spiel schneller zu erhalten!\n" +
      "Schnell, einfach und sicher.",
    tryServer2: "Server 2 ausprobieren (falls es nicht klappt)",
    tryOffers: "Aufgabe hier erledigen",
    noOffers: "Momentan keine Aufgaben verfügbar.",
    confirmExit: "Jetzt verlassen? Dein Fortschritt geht verloren.",
  },
} as const;