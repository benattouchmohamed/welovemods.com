/* ──────────────────────────────────────────────────────────────
   TYPES & INTERFACES
   ────────────────────────────────────────────────────────────── */

export type Locale =
  | "en"
  | "es"
  | "ko"
  | "ja"
  | "ar"
  | "fr"
  | "ru"
  | "de"
  | "tr"
  | "pt"
  | "zh"
  | "hi"
  | "it";

export interface TranslationFunctions {
  completeOneTask: string;
  gameReady: string;
  downloadStarts: string;
  offersCompleted: (done: number, total: number) => string;
  howToGuide: string;
  completeOffer: (n: number) => string;
  oneOffer: string;
  toGetTheGame: string;
  appDownloadTip: string;
  downloadNow: string;
  completeOfferBtn: string;
  completeNow: string;
  topSite: string;
  autoRedirect: string;
  mostUsers: (time: string) => string;
  language: string;
  playerFrom: string;
  tryServer2: string;
  notCompletedClickAgain: string;
  tryOffers?: string;
  noOffers?: string;
  confirmExit?: string;
  recommended: string;
  useMobileFaster: string;
  taskNotEasyChangeIt: string;
  // Pro Additionals for Trust
  secureConnection: string;
  verifiedUser: string;
}

/* ──────────────────────────────────────────────────────────────
   TRANSLATIONS DICTIONARY
   ────────────────────────────────────────────────────────────── */

export const translations: Record<Locale, TranslationFunctions> = {
  en: {
    completeOneTask: "Complete one quick step to prove you're not a bot",
    gameReady: "{game} is ready for download! Complete one step to start automatically",
    downloadStarts: "Your secure download will start automatically...",
    offersCompleted: (done, total) => `Verification: ${done}/${total} Steps Done`,
    howToGuide: "Unlock Guide (30 Seconds)",
    completeOffer: (n) => `Complete ${n} short task`,
    oneOffer: "1 tiny task",
    toGetTheGame: "to verify your session and start the download!",
    appDownloadTip: "Tip: Free apps are the fastest way to verify",
    downloadNow: "Verify & Download",
    completeOfferBtn: "Start Verification",
    completeNow: "Finish Task",
    topSite: "Verified by 2.4M+ Gamers",
    autoRedirect: "Instant Unlock Technology Active",
    mostUsers: (time) => `Avg. completion time: ${time}`,
    language: "Region",
    playerFrom: "Live from",
    tryServer2: "Switch to Global Server 2",
    notCompletedClickAgain: "Task not detected? Tap here to refresh",
    tryOffers: "Verify Here",
    noOffers: "No slots available. Please refresh in 1 minute.",
    confirmExit: "Wait! Your verification is almost finished.",
    recommended: "Fastest",
    useMobileFaster: "Recommended: Use Mobile for 2x faster verification",
    taskNotEasyChangeIt: "Task too hard? Click here for a new one",
    secureConnection: "SSL 256-bit Secure Connection",
    verifiedUser: "Verified Human"
  },
  es: {
    completeOneTask: "Completa una oferta rápida para probar que no eres un bot",
    gameReady: "¡{game} está listo para descargar! Completa un paso para iniciar automáticamente",
    downloadStarts: "Tu descarga segura comenzará automáticamente...",
    offersCompleted: (d, t) => `Verificación: ${d}/${t} pasos completados`,
    howToGuide: "Guía de Desbloqueo (30 Seg)",
    completeOffer: (n) => `Completa ${n} tarea corta`,
    oneOffer: "1 tarea rápida",
    toGetTheGame: "¡para verificar tu sesión y comenzar!",
    appDownloadTip: "Tip: Las apps gratuitas son las más rápidas",
    downloadNow: "Verificar y Descargar",
    completeOfferBtn: "Iniciar Verificación",
    completeNow: "Finalizar Tarea",
    topSite: "Verificado por +2.4M de jugadores",
    autoRedirect: "Tecnología de desbloqueo instantáneo activa",
    mostUsers: (t) => `Tiempo promedio: ${t}`,
    language: "Región",
    playerFrom: "Jugadores de",
    tryServer2: "Cambiar al Servidor Global 2",
    notCompletedClickAgain: "¿No se detectó? Toca para refrescar",
    tryOffers: "Verificar Aquí",
    noOffers: "Sin espacios disponibles. Refresca en 1 minuto.",
    confirmExit: "¡Espera! Tu verificación está casi lista.",
    recommended: "Más Rápido",
    useMobileFaster: "Recomendado: Usa móvil para mayor velocidad",
    taskNotEasyChangeIt: "¡Cambiar tarea por una más fácil!",
    secureConnection: "Conexión Segura SSL 256-bit",
    verifiedUser: "Humano Verificado"
  },
  ar: {
    completeOneTask: "أكمل عرضًا سريعًا واحدًا لإثبات أنك لست روبوت",
    gameReady: "{game} جاهز للتحميل! أكمل خطوة واحدة لبدء التحميل تلقائيًا",
    downloadStarts: "سيبدأ تحميلك الآمن تلقائيًا...",
    offersCompleted: (d, t) => `التحقق: ${d}/${t} خطوات مكتملة`,
    howToGuide: "دليل الفتح (30 ثانية)",
    completeOffer: (n) => `أكمل ${n} مهمة قصيرة`,
    oneOffer: "مهمة واحدة سريعة",
    toGetTheGame: "للتحقق من جلسة العمل وبدء التحميل فوراً!",
    appDownloadTip: "نصيحة: التطبيقات المجانية هي أسرع طريقة للتحقق",
    downloadNow: "تحقق وحمل الآن",
    completeOfferBtn: "ابدأ التحقق",
    completeNow: "إنهاء المهمة",
    topSite: "موثق من قبل +2.4 مليون لاعب",
    autoRedirect: "تقنية الفتح الفوري نشطة",
    mostUsers: (t) => `متوسط وقت الإكمال: ${t}`,
    language: "المنطقة",
    playerFrom: "مباشر من",
    tryServer2: "الانتقال إلى السيرفر العالمي 2",
    notCompletedClickAgain: "لم يتم الكشف؟ اضغط للتحديث",
    tryOffers: "تحقق هنا",
    noOffers: "لا توجد مساحات متاحة. يرجى التحديث بعد دقيقة.",
    confirmExit: "انتظر! التحقق أوشك على الانتهاء.",
    recommended: "الأسرع",
    useMobileFaster: "موصى به: استخدم الموبايل لتحقق أسرع مرتين",
    taskNotEasyChangeIt: "المهمة صعبة؟ اضغط هنا للحصول على مهمة جديدة",
    secureConnection: "اتصال آمن SSL 256-bit",
    verifiedUser: "إنسان موثق"
  },
  fr: {
    completeOneTask: "Complétez une offre rapide pour prouver que vous n’êtes pas un robot",
    gameReady: "{game} est prêt pour le téléchargement ! Complétez une étape pour démarrer automatiquement",
    downloadStarts: "Votre téléchargement sécurisé va démarrer automatiquement...",
    offersCompleted: (d, t) => `Vérification : ${d}/${t} étapes terminées`,
    howToGuide: "Guide de Déblocage (30 Secondes)",
    completeOffer: (n) => `Terminez ${n} petite tâche`,
    oneOffer: "1 petite tâche",
    toGetTheGame: "pour vérifier votre session et lancer le téléchargement !",
    appDownloadTip: "Astuce : Les apps gratuites sont le moyen le plus rapide",
    downloadNow: "Vérifier & Télécharger",
    completeOfferBtn: "Démarrer la Vérification",
    completeNow: "Terminer la Tâche",
    topSite: "Vérifié par +2.4M de joueurs",
    autoRedirect: "Technologie de Déblocage Instantané Active",
    mostUsers: (t) => `Temps moyen : ${t}`,
    language: "Région",
    playerFrom: "Joueurs en direct de",
    tryServer2: "Passer au Serveur Global 2",
    notCompletedClickAgain: "Tâche non détectée ? Appuyez pour rafraîchir",
    tryOffers: "Vérifier Ici",
    noOffers: "Aucun emplacement disponible. Réessayez dans 1 minute.",
    confirmExit: "Attendez ! Votre vérification est presque terminée.",
    recommended: "Le plus rapide",
    useMobileFaster: "Recommandé : Utilisez le mobile pour une vérification 2x plus rapide",
    taskNotEasyChangeIt: "Tâche trop difficile ? Cliquez ici pour en changer",
    secureConnection: "Connexion Sécurisée SSL 256-bit",
    verifiedUser: "Humain Vérifié"
  },
  de: {
    completeOneTask: "Schließe ein schnelles Angebot ab, um zu beweisen, dass du kein Bot bist",
    gameReady: "{game} ist bereit zum Download! Erledige einen Schritt, um automatisch zu starten",
    downloadStarts: "Dein sicherer Download startet automatisch...",
    offersCompleted: (d, t) => `Verifizierung: ${d}/${t} Schritte erledigt`,
    howToGuide: "Freischalt-Anleitung (30 Sekunden)",
    completeOffer: (n) => `${n} kurze Aufgabe abschließen`,
    oneOffer: "1 kleine Aufgabe",
    toGetTheGame: "um deine Sitzung zu verifizieren und den Download zu starten!",
    appDownloadTip: "Tipp: Kostenlose Apps sind der schnellste Weg",
    downloadNow: "Verifizieren & Herunterladen",
    completeOfferBtn: "Verifizierung Starten",
    completeNow: "Aufgabe Abschließen",
    topSite: "Verifiziert von +2.4M Spielern",
    autoRedirect: "Instant-Unlock-Technologie aktiv",
    mostUsers: (t) => `Durchschnittszeit: ${t}`,
    language: "Region",
    playerFrom: "Live aus",
    tryServer2: "Zu Global Server 2 wechseln",
    notCompletedClickAgain: "Aufgabe nicht erkannt? Zum Aktualisieren tippen",
    tryOffers: "Hier Verifizieren",
    noOffers: "Keine Plätze verfügbar. Bitte in 1 Minute aktualisieren.",
    confirmExit: "Warte! Deine Verifizierung ist fast abgeschlossen.",
    recommended: "Am schnellsten",
    useMobileFaster: "Empfohlen: Mobile für 2x schnellere Verifizierung nutzen",
    taskNotEasyChangeIt: "Aufgabe zu schwer? Hier klicken für eine neue",
    secureConnection: "SSL 256-bit Sichere Verbindung",
    verifiedUser: "Verifizierter Mensch"
  },
  it: {
    completeOneTask: "Completa un’offerta rapida per dimostrare che non sei un bot",
    gameReady: "{game} è pronto per il download! Completa un passaggio per avviare automaticamente",
    downloadStarts: "Il tuo download sicuro partirà automaticamente...",
    offersCompleted: (d, t) => `Verifica: ${d}/${t} passaggi completati`,
    howToGuide: "Guida Sblocco (30 Secondi)",
    completeOffer: (n) => `Completa ${n} breve attività`,
    oneOffer: "1 piccola attività",
    toGetTheGame: "per verificare la tua sessione e avviare il download!",
    appDownloadTip: "Consiglio: Le app gratuite sono il modo più veloce",
    downloadNow: "Verifica e Scarica",
    completeOfferBtn: "Avvia Verifica",
    completeNow: "Completa Attività",
    topSite: "Verificato da +2.4M di gamer",
    autoRedirect: "Tecnologia Sblocco Istantaneo Attiva",
    mostUsers: (t) => `Tempo medio: ${t}`,
    language: "Regione",
    playerFrom: "Live da",
    tryServer2: "Passa al Server Globale 2",
    notCompletedClickAgain: "Attività non rilevata? Tocca per aggiornare",
    tryOffers: "Verifica Qui",
    noOffers: "Nessuno slot disponibile. Aggiorna tra 1 minuto.",
    confirmExit: "Aspetta! La tua verifica è quasi completata.",
    recommended: "Più Veloce",
    useMobileFaster: "Consigliato: Usa il cellulare per verifica 2x più rapida",
    taskNotEasyChangeIt: "Attività troppo difficile? Clicca qui per cambiarla",
    secureConnection: "Connessione Sicura SSL 256-bit",
    verifiedUser: "Umano Verificado"
  },
  pt: {
    completeOneTask: "Complete uma oferta rápida para provar que você não é um bot",
    gameReady: "{game} está pronto para download! Complete um passo para iniciar automaticamente",
    downloadStarts: "Seu download seguro começará automaticamente...",
    offersCompleted: (d, t) => `Verificação: ${d}/${t} passos concluídos`,
    howToGuide: "Guia de Desbloqueio (30 Segundos)",
    completeOffer: (n) => `Complete ${n} tarefa curta`,
    oneOffer: "1 tarefa rápida",
    toGetTheGame: "para verificar sua sessão e iniciar o download!",
    appDownloadTip: "Dica: Apps gratuitas são a forma mais rápida",
    downloadNow: "Verificar e Baixar",
    completeOfferBtn: "Iniciar Verificação",
    completeNow: "Finalizar Tarefa",
    topSite: "Verificado por +2.4M de jogadores",
    autoRedirect: "Tecnologia de Desbloqueio Instantâneo Ativa",
    mostUsers: (t) => `Tempo médio: ${t}`,
    language: "Região",
    playerFrom: "Jogadores ao vivo de",
    tryServer2: "Mudar para Servidor Global 2",
    notCompletedClickAgain: "Tarefa não detectada? Toque para atualizar",
    tryOffers: "Verificar Aqui",
    noOffers: "Sem vagas disponíveis. Atualize em 1 minuto.",
    confirmExit: "Espere! Sua verificação está quase concluída.",
    recommended: "Mais Rápido",
    useMobileFaster: "Recomendado: Use celular para verificação 2x mais rápida",
    taskNotEasyChangeIt: "Tarefa difícil? Clique aqui para trocar",
    secureConnection: "Conexão Segura SSL 256-bit",
    verifiedUser: "Humano Verificado"
  },
  tr: {
    completeOneTask: "Bot olmadığını kanıtlamak için bir hızlı teklif tamamla",
    gameReady: "{game} indirmeye hazır! Otomatik başlaması için bir adım tamamla",
    downloadStarts: "Güvenli indirme otomatik olarak başlayacak...",
    offersCompleted: (d, t) => `Doğrulama: ${d}/${t} Adım Tamamlandı`,
    howToGuide: "Kilidi Açma Rehberi (30 Saniye)",
    completeOffer: (n) => `${n} kısa görev tamamla`,
    oneOffer: "1 küçük görev",
    toGetTheGame: "oturumunu doğrula ve indirmeyi başlat!",
    appDownloadTip: "İpucu: Ücretsiz uygulamalar en hızlı yöntem",
    downloadNow: "Doğrula ve İndir",
    completeOfferBtn: "Doğrulamayı Başlat",
    completeNow: "Görevi Bitir",
    topSite: "+2.4M Oyuncu Tarafından Doğrulanmış",
    autoRedirect: "Anında Kilit Açma Teknolojisi Aktif",
    mostUsers: (t) => `Ortalama tamamlanma: ${t}`,
    language: "Bölge",
    playerFrom: "Canlı oyuncular",
    tryServer2: "Global Sunucu 2'ye Geç",
    notCompletedClickAgain: "Görev algılanmadı mı? Yenilemek için dokun",
    tryOffers: "Burada Doğrula",
    noOffers: "Şu anda yer yok. 1 dakika içinde yenile.",
    confirmExit: "Dur! Doğrulaman neredeyse bitti.",
    recommended: "En Hızlı",
    useMobileFaster: "Önerilen: Mobil ile 2 kat hızlı doğrulama",
    taskNotEasyChangeIt: "Görev zor mu? Yeni görev için buraya tıkla",
    secureConnection: "SSL 256-bit Güvenli Bağlantı",
    verifiedUser: "Doğrulanmış İnsan"
  },
  ru: {
    completeOneTask: "Выполни одно быстрое предложение, чтобы доказать, что ты не бот",
    gameReady: "{game} готов к скачиванию! Выполни один шаг, чтобы начать автоматически",
    downloadStarts: "Ваша безопасная загрузка начнётся автоматически...",
    offersCompleted: (d, t) => `Проверка: ${d}/${t} шагов выполнено`,
    howToGuide: "Руководство по разблокировке (30 секунд)",
    completeOffer: (n) => `Выполни ${n} короткое задание`,
    oneOffer: "1 простое задание",
    toGetTheGame: "чтобы подтвердить сессию и начать загрузку!",
    appDownloadTip: "Совет: Бесплатные приложения — самый быстрый способ",
    downloadNow: "Проверить и Скачать",
    completeOfferBtn: "Начать Проверку",
    completeNow: "Завершить Задание",
    topSite: "Проверено более 2.4 млн игроков",
    autoRedirect: "Технология мгновенной разблокировки активна",
    mostUsers: (t) => `Среднее время: ${t}`,
    language: "Регион",
    playerFrom: "Игроки из",
    tryServer2: "Переключиться на Глобальный Сервер 2",
    notCompletedClickAgain: "Задание не засчитано? Нажми для обновления",
    tryOffers: "Проверить Здесь",
    noOffers: "Нет свободных слотов. Обновите через 1 минуту.",
    confirmExit: "Подожди! Проверка почти завершена.",
    recommended: "Самый быстрый",
    useMobileFaster: "Рекомендуется: Мобильная версия — в 2 раза быстрее",
    taskNotEasyChangeIt: "Задание сложное? Нажми сюда для смены",
    secureConnection: "Защищённое соединение SSL 256-bit",
    verifiedUser: "Проверенный человек"
  },
  zh: {
    completeOneTask: "完成一个快速任务以证明你不是机器人",
    gameReady: "{game} 已准备好下载！完成一个步骤即可自动开始",
    downloadStarts: "您的安全下载即将自动开始...",
    offersCompleted: (d, t) => `验证进度：${d}/${t} 步骤完成`,
    howToGuide: "解锁指南（30秒）",
    completeOffer: (n) => `完成 ${n} 个快速任务`,
    oneOffer: "1 个简单任务",
    toGetTheGame: "验证你的会话并开始下载！",
    appDownloadTip: "提示：免费应用是最快的验证方式",
    downloadNow: "验证并下载",
    completeOfferBtn: "开始验证",
    completeNow: "完成任务",
    topSite: "超过240万玩家验证",
    autoRedirect: "即时解锁技术已激活",
    mostUsers: (t) => `平均完成时间：${t}`,
    language: "地区",
    playerFrom: "实时玩家来自",
    tryServer2: "切换到全球服务器2",
    notCompletedClickAgain: "任务未检测到？点击刷新",
    tryOffers: "在此验证",
    noOffers: "当前无可用名额。请1分钟后刷新。",
    confirmExit: "等等！你的验证快完成了。",
    recommended: "最快",
    useMobileFaster: "推荐：手机验证速度快2倍",
    taskNotEasyChangeIt: "任务太难？点击这里换一个",
    secureConnection: "SSL 256位安全连接",
    verifiedUser: "已验证人类"
  },
  ko: {
    completeOneTask: "봇이 아님을 증명하기 위해 하나의 빠른 오퍼를 완료하세요",
    gameReady: "{game} 다운로드 준비 완료! 한 단계 완료하면 자동으로 시작됩니다",
    downloadStarts: "안전한 다운로드가 자동으로 시작됩니다...",
    offersCompleted: (d, t) => `인증: ${d}/${t} 단계 완료`,
    howToGuide: "잠금 해제 가이드 (30초)",
    completeOffer: (n) => `${n}개의 짧은 작업 완료`,
    oneOffer: "1개의 간단한 작업",
    toGetTheGame: "세션을 확인하고 다운로드를 시작하세요!",
    appDownloadTip: "팁: 무료 앱이 가장 빠른 인증 방법입니다",
    downloadNow: "인증하고 다운로드",
    completeOfferBtn: "인증 시작",
    completeNow: "작업 완료",
    topSite: "240만 명 이상의 게이머가 인증",
    autoRedirect: "즉시 잠금 해제 기술 활성화",
    mostUsers: (t) => `평균 완료 시간: ${t}`,
    language: "지역",
    playerFrom: "실시간 플레이어",
    tryServer2: "글로벌 서버 2로 전환",
    notCompletedClickAgain: "작업 감지 안 됨? 새로고침하려면 탭",
    tryOffers: "여기서 인증",
    noOffers: "현재 슬롯 없음. 1분 후 새로고침하세요.",
    confirmExit: "잠깐! 인증이 거의 끝났습니다.",
    recommended: "가장 빠름",
    useMobileFaster: "추천: 모바일로 2배 빠른 인증",
    taskNotEasyChangeIt: "작업이 어려우신가요? 새 작업으로 변경하려면 클릭",
    secureConnection: "SSL 256-bit 보안 연결",
    verifiedUser: "인증된 인간"
  },
  ja: {
    completeOneTask: "ボットではないことを証明するために1つの簡単なオファーを完了してください",
    gameReady: "{game} のダウンロード準備完了！1ステップ完了で自動開始",
    downloadStarts: "安全なダウンロードが自動的に開始されます...",
    offersCompleted: (d, t) => `認証: ${d}/${t} ステップ完了`,
    howToGuide: "アンロックガイド（30秒）",
    completeOffer: (n) => `${n}つの短いタスクを完了`,
    oneOffer: "1つの簡単タスク",
    toGetTheGame: "セッションを認証してダウンロードを開始！",
    appDownloadTip: "ヒント：無料アプリが最速の認証方法です",
    downloadNow: "認証してダウンロード",
    completeOfferBtn: "認証を開始",
    completeNow: "タスクを完了",
    topSite: "240万人以上のゲーマーにより認証済み",
    autoRedirect: "即時アンロック技術が有効です",
    mostUsers: (t) => `平均完了時間: ${t}`,
    language: "地域",
    playerFrom: "ライブプレイヤー",
    tryServer2: "グローバルサーバー2に切り替え",
    notCompletedClickAgain: "タスクが検出されませんか？更新するにはタップ",
    tryOffers: "ここで認証",
    noOffers: "現在スロットがありません。1分後に更新してください。",
    confirmExit: "待って！認証がほぼ完了しました。",
    recommended: "最速",
    useMobileFaster: "推奨：モバイルで2倍速く認証",
    taskNotEasyChangeIt: "タスクが難しい？新しいタスクに変更するにはここをクリック",
    secureConnection: "SSL 256-bit セキュア接続",
    verifiedUser: "認証済み人間"
  },
  hi: {
    completeOneTask: "एक त्वरित ऑफर पूरा करें ताकि साबित हो कि आप बॉट नहीं हैं",
    gameReady: "{game} डाउनलोड के लिए तैयार है! एक स्टेप पूरा करें तो ऑटोमैटिक शुरू हो जाएगा",
    downloadStarts: "आपका सुरक्षित डाउनलोड अपने आप शुरू हो जाएगा...",
    offersCompleted: (d, t) => `वेरिफिकेशन: ${d}/${t} स्टेप्स पूरे`,
    howToGuide: "अनलॉक गाइड (30 सेकंड)",
    completeOffer: (n) => `${n} छोटा टास्क पूरा करें`,
    oneOffer: "1 आसान टास्क",
    toGetTheGame: "अपना सेशन वेरीफाई करने और डाउनलोड शुरू करने के लिए!",
    appDownloadTip: "टिप: फ्री ऐप्स वेरिफिकेशन का सबसे तेज़ तरीका हैं",
    downloadNow: "वेरीफाई और डाउनलोड",
    completeOfferBtn: "वेरिफिकेशन शुरू करें",
    completeNow: "टास्क पूरा करें",
    topSite: "24 लाख+ गेमर्स का भरोसा",
    autoRedirect: "इंस्टेंट अनलॉक टेक्नोलॉजी सक्रिय",
    mostUsers: (t) => `औसत समय: ${t}`,
    language: "क्षेत्र",
    playerFrom: "लाइव प्लेयर्स",
    tryServer2: "ग्लोबल सर्वर 2 पर स्विच करें",
    notCompletedClickAgain: "टास्क नहीं दिखा? रिफ्रेश करने के लिए टैप करें",
    tryOffers: "यहाँ वेरीफाई करें",
    noOffers: "अभी कोई स्लॉट खाली नहीं है। 1 मिनट में ट्राई करें।",
    confirmExit: "रुकें! आपका वेरिफिकेशन लगभग पूरा हो गया है।",
    recommended: "सबसे तेज़",
    useMobileFaster: "मोबाइल पर 2 गुना तेज़ वेरिफिकेशन",
    taskNotEasyChangeIt: "टास्क मुश्किल है? बदलने के लिए यहाँ क्लिक करें",
    secureConnection: "SSL सुरक्षित कनेक्शन",
    verifiedUser: "वेरीफाइड ह्यूमन"
  }
} as const;

/* ──────────────────────────────────────────────────────────────
   HELPERS & INTEGRATION
   ────────────────────────────────────────────────────────────── */

export const getTranslation = (locale: Locale): TranslationFunctions => {
  return translations[locale] || translations.en;
};