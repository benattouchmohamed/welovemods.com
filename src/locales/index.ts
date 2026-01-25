/* ──────────────────────────────────────────────────────────────
   TYPES & INTERFACES
   ────────────────────────────────────────────────────────────── */

export type Locale =
  | "en" | "es" | "ko" | "ja" | "ar" | "fr" | "ru"
  | "de" | "tr" | "pt" | "zh" | "hi" | "it";

export interface TranslationFunctions {
  syncing: string;
  completeTasks: string;
  autoRedirect: string;
  btn: string;
}

/* ──────────────────────────────────────────────────────────────
   TRANSLATIONS – Clean, trusted, professional
   ────────────────────────────────────────────────────────────── */

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    syncing: "Establishing a secure connection...",
    completeTasks: "Verification Required",
    autoRedirect: "Complete 1 task to start your download",
    btn: "Continue",
  },

  fr: {
    syncing: "Établissement d’une connexion sécurisée...",
    completeTasks: "Vérification requise",
    autoRedirect: "Terminez 1 tâche pour démarrer votre téléchargement",
    btn: "Continuer",
  },

  ar: {
    syncing: "جارٍ إنشاء اتصال آمن...",
    completeTasks: "مطلوب التحقق",
    autoRedirect: "أكمل مهمة واحدة لبدء التحميل",
    btn: "متابعة",
  },

  es: {
    syncing: "Estableciendo una conexión segura...",
    completeTasks: "Verificación requerida",
    autoRedirect: "Completa 1 tarea para iniciar tu descarga",
    btn: "Continuar",
  },

  de: {
    syncing: "Sichere Verbindung wird hergestellt...",
    completeTasks: "Verifizierung erforderlich",
    autoRedirect: "Schließen Sie 1 Aufgabe ab, um den Download zu starten",
    btn: "Weiter",
  },

  pt: {
    syncing: "Estabelecendo conexão segura...",
    completeTasks: "Verificação necessária",
    autoRedirect: "Conclua 1 tarefa para iniciar o download",
    btn: "Continuar",
  },

  ru: {
    syncing: "Устанавливается безопасное соединение...",
    completeTasks: "Требуется проверка",
    autoRedirect: "Выполните 1 задание, чтобы начать загрузку",
    btn: "Продолжить",
  },

  tr: {
    syncing: "Güvenli bağlantı kuruluyor...",
    completeTasks: "Doğrulama gerekli",
    autoRedirect: "İndirmeyi başlatmak için 1 görevi tamamlayın",
    btn: "Devam",
  },

  it: {
    syncing: "Connessione sicura in corso...",
    completeTasks: "Verifica richiesta",
    autoRedirect: "Completa 1 attività per avviare il download",
    btn: "Continua",
  },

  zh: {
    syncing: "正在建立安全连接...",
    completeTasks: "需要验证",
    autoRedirect: "完成 1 个任务即可开始下载",
    btn: "继续",
  },

  ja: {
    syncing: "安全な接続を確立しています...",
    completeTasks: "確認が必要です",
    autoRedirect: "ダウンロードを開始するには 1 つのタスクを完了してください",
    btn: "続行",
  },

  ko: {
    syncing: "보안 연결을 설정하는 중...",
    completeTasks: "확인이 필요합니다",
    autoRedirect: "다운로드를 시작하려면 1개의 작업을 완료하세요",
    btn: "계속",
  },

  hi: {
    syncing: "सुरक्षित कनेक्शन स्थापित किया जा रहा है...",
    completeTasks: "सत्यापन आवश्यक",
    autoRedirect: "डाउनलोड शुरू करने के लिए 1 कार्य पूरा करें",
    btn: "जारी रखें",
  },
};

/* ──────────────────────────────────────────────────────────────
   HELPER FUNCTION
   ────────────────────────────────────────────────────────────── */

export const getTranslation = (locale: string): TranslationFunctions => {
  const validLocale = (Object.keys(translations).includes(locale)
    ? locale
    : "en") as Locale;

  return translations[validLocale];
};
