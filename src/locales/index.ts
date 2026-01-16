/* ──────────────────────────────────────────────────────────────
   TYPES & INTERFACES
   ────────────────────────────────────────────────────────────── */

export type Locale = 
  | "en" | "es" | "ko" | "ja" | "ar" | "fr" | "ru" 
  | "de" | "tr" | "pt" | "zh" | "hi" | "it";

export interface TranslationFunctions {
  completeTasks: string;       // Sticker Card: "Complete one quick 2 steps..."
  autoRedirect: string;        // Sticker Card: "Once you finish 2 tasks..."
  status: (done: number) => string; // Progress Pill: "0 of 2 tasks Completed"
  syncing: string;             // Sticker Card Subtitle: "System Syncing..."
  btn: string;                 // Modal Button: "Download Now"
}

/* ──────────────────────────────────────────────────────────────
   PRO TRANSLATIONS (All 13 Languages)
   ────────────────────────────────────────────────────────────── */

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    completeTasks: "Complete one quick 2 steps to prove you're not a bot",
    autoRedirect: "Once you finish 2 tasks, your download will start automatically",
    status: (done) => `${done} of 2 tasks Completed`,
    syncing: "System Syncing...",
    btn: "Download Now"
  },
  es: {
    completeTasks: "Completa 2 pasos rápidos para demostrar que no eres un robot",
    autoRedirect: "Una vez que termines 2 tareas, tu descarga comenzará automáticamente",
    status: (done) => `${done} de 2 tareas completadas`,
    syncing: "Sincronizando sistema...",
    btn: "Descargar ahora"
  },
  ar: {
    completeTasks: "أكمل خطوتين سريعتين لإثبات أنك لست روبوتًا",
    autoRedirect: "بمجرد الانتهاء من مهمتين، سيبدأ التحميل تلقائياً",
    status: (done) => `تم إكمال ${done} من 2 مهام`,
    syncing: "جاري مزامنة النظام...",
    btn: "حمل الآن"
  },
  fr: {
    completeTasks: "Complétez 2 étapes rapides pour prouver que vous n'êtes pas un robot",
    autoRedirect: "Une fois les 2 tâches finies, le téléchargement commencera",
    status: (done) => `${done} sur 2 tâches terminées`,
    syncing: "Synchronisation...",
    btn: "Télécharger"
  },
  de: {
    completeTasks: "Schließe 2 kurze Schritte ab, um zu beweisen, dass du kein Bot bist",
    autoRedirect: "Sobald du 2 Aufgaben erledigt hast, startet der Download automatisch",
    status: (done) => `${done} von 2 Aufgaben erledigt`,
    syncing: "System-Synchronisierung...",
    btn: "Jetzt herunterladen"
  },
  it: {
    completeTasks: "Completa 2 rapidi passaggi per dimostrare che non sei un robot",
    autoRedirect: "Una volta completate 2 attività, il download inizierà automaticamente",
    status: (done) => `${done} di 2 attività completate`,
    syncing: "Sincronizzazione...",
    btn: "Scarica ora"
  },
  pt: {
    completeTasks: "Conclua 2 etapas rápidas para provar que você não é um robô",
    autoRedirect: "Assim que terminar 2 tarefas, o download começará automaticamente",
    status: (done) => `${done} de 2 tarefas concluídas`,
    syncing: "Sincronizando...",
    btn: "Baixar agora"
  },
  tr: {
    completeTasks: "Bot olmadığınızı kanıtlamak için 2 hızlı adımı tamamlayın",
    autoRedirect: "2 görevi tamamladığınızda indirme otomatik olarak başlayacaktır",
    status: (done) => `2 görevden ${done} tanesi tamamlandı`,
    syncing: "Senkronize ediliyor...",
    btn: "Şimdi İndir"
  },
  ru: {
    completeTasks: "Выполните 2 быстрых шага, чтобы доказать, что вы не бот",
    autoRedirect: "После выполнения 2 заданий загрузка начнется автоматически",
    status: (done) => `Выполнено ${done} из 2 заданий`,
    syncing: "Синхронизация...",
    btn: "Скачать"
  },
  zh: {
    completeTasks: "完成 2 个快速步骤以证明您不是机器人",
    autoRedirect: "完成 2 个任务后，下载将自动开始",
    status: (done) => `已完成 2 个任务中的 ${done} 个`,
    syncing: "系统同步中...",
    btn: "立即下载"
  },
  ko: {
    completeTasks: "봇이 아님을 증명하기 위해 2단계의 빠른 절차를 완료하세요",
    autoRedirect: "2개 작업을 완료하면 다운로드가 자동으로 시작됩니다",
    status: (done) => `2개 작업 중 ${done}개 완료`,
    syncing: "동기화 중...",
    btn: "다운로드"
  },
  ja: {
    completeTasks: "ロボットでないことを証明するために、2つの簡単なステップを完了してください",
    autoRedirect: "2つのタスクを完了すると、ダウンロードが自動的に開始されます",
    status: (done) => `2つのタスクのうち ${done} つを完了`,
    syncing: "同期中...",
    btn: "ダウンロード"
  },
  hi: {
    completeTasks: "यह साबित करने के लिए कि आप रोबोट नहीं हैं, 2 त्वरित चरणों को पूरा करें",
    autoRedirect: "2 टास्क पूरे होने पर डाउनलोड अपने आप शुरू हो जाएगा",
    status: (done) => `2 में से ${done} टास्क पूरे हुए`,
    syncing: "सिंक हो रहा है...",
    btn: "अभी डाउनलोड करें"
  }
} as const;

/* ──────────────────────────────────────────────────────────────
   HELPER FUNCTION
   ────────────────────────────────────────────────────────────── */

export const getTranslation = (locale: Locale): TranslationFunctions => {
  return translations[locale] || translations.en;
};