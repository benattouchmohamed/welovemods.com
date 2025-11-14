export type Locale =
  | "en"
  | "es"
  | "ko"
  | "ja"
  | "ar"
  | "fr"
  | "ru"
  | "de"
  | "pt"
  | "zh"
  | "hi"
  | "it";

interface TranslationFunctions {
  // Header & Verification
  completeOneTask: string;
  gameReady: string;               // ← now contains the full message
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
    gameReady:
      "Once you finish 1 task, {game} will start downloading automatically!",
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
    tryServer2: "server 2 ",
    tryOffers: "Complete Task Here",
    noOffers: "No tasks available at the moment.",
    confirmExit: "Leave now? Your progress will be lost.",
  },
pt: {
  completeOneTask: "Complete uma tarefa para provar que não é um robô",
  gameReady: "Assim que terminar 1 tarefa, {game} começará a baixar automaticamente!",
  downloadStarts: "Seu download iniciará automaticamente.",
  offersCompleted: (d, t) => `${d} / ${t} tarefa concluída`,
  howToGuide: "Guia Passo a Passo",
  completeOffer: (n) => `Complete ${n} tarefa rápida`,
  oneOffer: "1 tarefa",
  toGetTheGame: "para baixar instantaneamente.",
  appDownloadTip: "Instale e abra qualquer app por 30 segundos – rápido e seguro.",
  downloadNow: "Iniciar Download",
  completeOfferBtn: "Completar Tarefa",
  completeNow: "Completar Agora",
  topSite: "Confiável por milhões de gamers no mundo",
  autoRedirect: "download instantâneo após tarefa",
  mostUsers: (t) => `A maioria baixa em menos de ${t}`,
  language: "Idioma",
  playerFrom: "Jogador de",
  unlocked: "baixado com sucesso",
  usersOnline: "usuários ativos",
  error: "Falha ao carregar tarefa. Tente o link espelho abaixo.",
  supportNote:
    "100% Grátis • Verificado Seguro\nLeia a tarefa para provar que é humano e receber seu jogo mais rápido!",
  tryServer2: "servidor 2",
  tryOffers: "Completar Tarefa Aqui",
  noOffers: "Nenhuma tarefa disponível no momento.",
  confirmExit: "Sair agora? Você perderá o progresso.",
},
zh: {
  completeOneTask: "完成一个任务以证明你不是机器人",
  gameReady: "完成 1 个任务后，{game} 将自动开始下载！",
  downloadStarts: "下载将自动开始。",
  offersCompleted: (d, t) => `${d} / ${t} 个任务已完成`,
  howToGuide: "步骤指南",
  completeOffer: (n) => `完成 ${n} 个快速任务`,
  oneOffer: "1 个任务",
  toGetTheGame: "即可立即下载。",
  appDownloadTip: "安装并打开任意应用 30 秒 – 快速安全。",
  downloadNow: "开始下载",
  completeOfferBtn: "完成任务",
  completeNow: "立即完成",
  topSite: "全球数百万玩家信任",
  autoRedirect: "任务后立即下载",
  mostUsers: (t) => `大多数用户在 ${t} 内下载完成`,
  language: "语言",
  playerFrom: "来自",
  unlocked: "下载成功",
  usersOnline: "在线用户",
  error: "加载失败，请尝试下面的镜像链接。",
  supportNote:
    "100% 免费 • 安全验证\n阅读任务说明可更快完成验证并获取游戏！",
  tryServer2: "服务器 2",
  tryOffers: "在此完成任务",
  noOffers: "暂无任务可用。",
  confirmExit: "确定离开吗？进度将丢失。",
},
hi: {
  completeOneTask: "साबित करने के लिए एक कार्य पूरा करें कि आप बॉट नहीं हैं",
  gameReady: "जैसे ही आप 1 कार्य पूरा करते हैं, {game} स्वतः डाउनलोड होना शुरू हो जाएगा!",
  downloadStarts: "डाउनलोड स्वतः शुरू होगा.",
  offersCompleted: (d, t) => `${d} / ${t} कार्य पूरा`,
  howToGuide: "स्टेप-बाय-स्टेप गाइड",
  completeOffer: (n) => `${n} तेज़ कार्य पूरा करें`,
  oneOffer: "1 कार्य",
  toGetTheGame: "तुरंत डाउनलोड के लिए।",
  appDownloadTip: "कोई भी ऐप इंस्टॉल करें और 30 सेकंड खोलें – तेज़ और सुरक्षित।",
  downloadNow: "डाउनलोड शुरू करें",
  completeOfferBtn: "कार्य पूरा करें",
  completeNow: "अभी पूरा करें",
  topSite: "दुनिया भर के लाखों गेमर्स का भरोसा",
  autoRedirect: "कार्य के बाद तुरंत डाउनलोड",
  mostUsers: (t) => `अधिकतर लोग ${t} में डाउनलोड कर लेते हैं`,
  language: "भाषा",
  playerFrom: "प्लेयर",
  unlocked: "सफलतापूर्वक डाउनलोड",
  usersOnline: "सक्रिय उपयोगकर्ता",
  error: "लोड करने में विफल। नीचे दिए गए लिंक का प्रयास करें।",
  supportNote:
    "100% मुफ्त • सुरक्षित\nकार्य विवरण पढ़ें और जल्दी सत्यापन पूरा करें!",
  tryServer2: "सर्वर 2",
  tryOffers: "कार्य यहाँ पूरा करें",
  noOffers: "अभी कोई कार्य उपलब्ध नहीं है।",
  confirmExit: "अभी बाहर निकलें? प्रगति खो जाएगी.",
},
it: {
  completeOneTask: "Completa un'attività per dimostrare che non sei un bot",
  gameReady: "Una volta completata 1 attività, {game} inizierà il download automaticamente!",
  downloadStarts: "Il download inizierà automaticamente.",
  offersCompleted: (d, t) => `${d} / ${t} attività completata`,
  howToGuide: "Guida Passo-Passo",
  completeOffer: (n) => `Completa ${n} attività veloce`,
  oneOffer: "1 attività",
  toGetTheGame: "per scaricare subito.",
  appDownloadTip: "Installa e apri un’app per 30 secondi – veloce e sicuro.",
  downloadNow: "Avvia Download",
  completeOfferBtn: "Completa Attività",
  completeNow: "Completa Ora",
  topSite: "Scelto da milioni di gamer nel mondo",
  autoRedirect: "download immediato dopo attività",
  mostUsers: (t) => `La maggior parte scarica in meno di ${t}`,
  language: "Lingua",
  playerFrom: "Giocatore da",
  unlocked: "scaricato con successo",
  usersOnline: "utenti attivi",
  error: "Caricamento fallito. Prova il link mirror sotto.",
  supportNote:
    "100% Gratis • Verificato Sicuro\nLeggi la descrizione per completare la verifica più velocemente!",
  tryServer2: "server 2",
  tryOffers: "Completa attività qui",
  noOffers: "Nessuna attività disponibile al momento.",
  confirmExit: "Uscire ora? Progresso perso.",
},

  es: {
    completeOneTask: "Completa una tarea para demostrar que no eres un bot",
    gameReady:
      "¡Una vez completes 1 tarea, {game} comenzará a descargarse automáticamente!",
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
    tryServer2: "servidor 2",
    tryOffers: "Completar Tarea Aquí",
    noOffers: "No hay tareas disponibles ahora.",
    confirmExit: "¿Salir ahora? Perderás tu progreso.",
  },

  ko: {
    completeOneTask: "봇이 아님을 증명하기 위해 1개의 작업을 완료하세요",
    gameReady:
      "1개의 작업을 마치면 {game}이(가) 자동으로 다운로드 시작됩니다!",
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
    tryServer2: "서버 2",
    tryOffers: "여기서 작업 완료",
    noOffers: "현재 작업 없음",
    confirmExit: "지금 나가면 진행 상황이 사라집니다.",
  },

  ja: {
    completeOneTask: "ボットでないことを証明するため 1 つのタスクを完了してください",
    gameReady:
      "1 つのタスクを完了すると、{game} が自動的にダウンロードを開始します！",
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
    tryServer2: "サーバー2",
    tryOffers: "ここでタスクを完了",
    noOffers: "現在タスクはありません",
    confirmExit: "今終了しますか？進行状況が失われます。",
  },

  ar: {
    completeOneTask: "أكمل مهمة واحدة لإثبات أنك لست روبوت",
    gameReady:
      "بمجرد إكمال مهمة واحدة، سيبدأ {game} التحميل تلقائيًا!",
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
    tryServer2: " السيرفر 2 ", 
    tryOffers: "أكمل المهمة هنا",
    noOffers: "لا توجد مهام متاحة الآن.",
    confirmExit: "الخروج الآن؟ سيتم فقدان التقدم.",
  },

  fr: {
    completeOneTask: "Terminez une tâche pour prouver que vous n’êtes pas un robot",
    gameReady:
      "Dès que vous terminez 1 tâche, {game} démarrera le téléchargement automatiquement !",
    downloadStarts: "Le téléchargement démarre automatiquement.",
    offersCompleted: (done, total) => `${done} / ${total} tâche terminée`,
    howToGuide: "Guide étape par étape",
    completeOffer: (n) => `Terminer ${n} tâche rapide`,
    oneOffer: "1 tâche",
    toGetTheGame: "pour télécharger instantanément.",
    appDownloadTip: "Installez et ouvrez une app 30 s – rapide et sécurisé.",
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
    tryServer2: "Serveur 2",
    tryOffers: "Terminer la tâche ici",
    noOffers: "Aucune tâche disponible pour le moment.",
    confirmExit: "Quitter maintenant ? Votre progression sera perdue.",
  },

  ru: {
    completeOneTask: "Выполните одно задание, чтобы доказать, что вы не бот",
    gameReady:
      "Как только вы завершите 1 задание, {game} начнёт скачиваться автоматически!",
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
    tryServer2: "сервер 2 ",
    tryOffers: "Выполнить задание здесь",
    noOffers: "Нет доступных заданий.",
    confirmExit: "Выйти? Прогресс будет потерян.",
  },

  de: {
    completeOneTask: "Erledige eine Aufgabe, um zu beweisen, dass du kein Bot bist",
    gameReady:
      "Sobald du 1 Aufgabe erledigst, wird {game} automatisch heruntergeladen!",
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
    tryServer2: "Server 2 ",
    tryOffers: "Aufgabe hier erledigen",
    noOffers: "Momentan keine Aufgaben verfügbar.",
    confirmExit: "Jetzt verlassen? Dein Fortschritt geht verloren.",
  },
} as const;