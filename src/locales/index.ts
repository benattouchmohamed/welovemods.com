/* ──────────────────────────────────────────────────────────────
   TYPES & INTERFACES
   ────────────────────────────────────────────────────────────── */

export type Locale =
  | "en" | "es" | "ko" | "ja" | "ar" | "fr" | "ru"
  | "de" | "tr" | "pt" | "zh" | "hi" | "it";

export interface TranslationFunctions {
  completeTasks: string;               // Sticker Card title
  autoRedirect: string;                // Sticker Card subtitle
  status: (done: number) => string;    // Progress pill text
  syncing: string;                     // Sync text
  btn: string;                         // Button text
}

/* ──────────────────────────────────────────────────────────────
   TRANSLATIONS
   ────────────────────────────────────────────────────────────── */

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    syncing: "Syncing with server...",
    completeTasks: "Verification Required",
    autoRedirect: "Complete 1 task to start your download",
    status: (count) =>
      count > 0 ? "Verifying Completion..." : "Waiting for completion",
    btn: "Install & Verify",
  },

  fr: {
    syncing: "Synchronisation avec le serveur...",
    completeTasks: "Vérification requise",
    autoRedirect: "Complétez 1 tâche pour démarrer le téléchargement",
    status: (count) =>
      count > 0 ? "Vérification en cours..." : "En attente de validation",
    btn: "Installer & Vérifier",
  },

  ar: {
    syncing: "جارٍ المزامنة مع الخادم...",
    completeTasks: "مطلوب التحقق",
    autoRedirect: "أكمل مهمة واحدة لبدء التحميل",
    status: (count) =>
      count > 0 ? "جارٍ التحقق من الإكمال..." : "في انتظار الإكمال",
    btn: "تثبيت والتحقق",
  },

  es: {
    syncing: "Sincronizando con el servidor...",
    completeTasks: "Verificación requerida",
    autoRedirect: "Completa 1 tarea para iniciar la descarga",
    status: (count) =>
      count > 0 ? "Verificando finalización..." : "Esperando finalización",
    btn: "Instalar y Verificar",
  },

  de: {
    syncing: "Synchronisiere mit dem Server...",
    completeTasks: "Verifizierung erforderlich",
    autoRedirect: "Schließe 1 Aufgabe ab, um den Download zu starten",
    status: (count) =>
      count > 0 ? "Überprüfung läuft..." : "Warten auf Abschluss",
    btn: "Installieren & Prüfen",
  },

  pt: {
    syncing: "Sincronizando com o servidor...",
    completeTasks: "Verificação necessária",
    autoRedirect: "Complete 1 tarefa para iniciar o download",
    status: (count) =>
      count > 0 ? "Verificando conclusão..." : "Aguardando conclusão",
    btn: "Instalar e Verificar",
  },

  ru: {
    syncing: "Синхронизация с сервером...",
    completeTasks: "Требуется проверка",
    autoRedirect: "Выполните 1 задание, чтобы начать загрузку",
    status: (count) =>
      count > 0 ? "Проверка завершения..." : "Ожидание выполнения",
    btn: "Установить и проверить",
  },

  tr: {
    syncing: "Sunucu ile senkronize ediliyor...",
    completeTasks: "Doğrulama Gerekli",
    autoRedirect: "İndirmeye başlamak için 1 görev tamamla",
    status: (count) =>
      count > 0 ? "Doğrulama yapılıyor..." : "Tamamlanması bekleniyor",
    btn: "Yükle ve Doğrula",
  },

  it: {
    syncing: "Sincronizzazione con il server...",
    completeTasks: "Verifica richiesta",
    autoRedirect: "Completa 1 attività per avviare il download",
    status: (count) =>
      count > 0 ? "Verifica in corso..." : "In attesa di completamento",
    btn: "Installa e Verifica",
  },

  zh: {
    syncing: "正在与服务器同步...",
    completeTasks: "需要验证",
    autoRedirect: "完成 1 个任务即可开始下载",
    status: (count) =>
      count > 0 ? "正在验证完成情况..." : "等待完成",
    btn: "安装并验证",
  },

  ja: {
    syncing: "サーバーと同期中...",
    completeTasks: "確認が必要です",
    autoRedirect: "ダウンロードを開始するには1つのタスクを完了してください",
    status: (count) =>
      count > 0 ? "確認中..." : "完了待ち",
    btn: "インストールして確認",
  },

  ko: {
    syncing: "서버와 동기화 중...",
    completeTasks: "인증 필요",
    autoRedirect: "다운로드를 시작하려면 1개 작업을 완료하세요",
    status: (count) =>
      count > 0 ? "완료 확인 중..." : "완료 대기 중",
    btn: "설치 및 확인",
  },

  hi: {
    syncing: "सर्वर से सिंक हो रहा है...",
    completeTasks: "सत्यापन आवश्यक",
    autoRedirect: "डाउनलोड शुरू करने के लिए 1 कार्य पूरा करें",
    status: (count) =>
      count > 0 ? "सत्यापन हो रहा है..." : "पूरा होने की प्रतीक्षा",
    btn: "इंस्टॉल और सत्यापित करें",
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
