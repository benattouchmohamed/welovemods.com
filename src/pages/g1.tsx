import React, { useEffect, useState } from "react";

/* --------------------------------------------------------------
   Helper: is TikTok in-app browser?
   -------------------------------------------------------------- */
const isTikTokBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();

  // TikTok app identifiers
  const tiktokKeywords = [
    "tiktok",
    "musical_ly",
    "musically",
    "zhiliaoapp",
    "com.zhiliaoapp.musically",
    "com.ss.android.ugc.aweme",
  ];

  // TikTok injects these on Android/iOS
  const hasTikTokProp =
    // @ts-ignore – TikTok injects this on Android
    (window as any).TikTokWebView !== undefined ||
    // @ts-ignore – iOS TikTok message handler
    (window as any).webkit?.messageHandlers?.TikTok !== undefined;

  const hasKeyword = tiktokKeywords.some((kw) => ua.includes(kw));

  return hasKeyword || hasTikTokProp;
};

const G1: React.FC = () => {
  const [insideTikTok, setInsideTikTok] = useState<boolean | null>(null);
  const externalUrl = "https://welovemods.com/";

  /* --------------------------------------------------------------
     Detect on mount
     -------------------------------------------------------------- */
  useEffect(() => {
    const tikTok = isTikTokBrowser();
    setInsideTikTok(tikTok);

    // If NOT in TikTok → redirect immediately
    if (!tikTok) {
      window.location.replace(externalUrl);
    }
  }, []);

  /* --------------------------------------------------------------
     Open external site (bypass TikTok in-app browser)
     -------------------------------------------------------------- */
  const openInRealBrowser = () => {
    // Method 1: Try window.open
    try {
      const newWin = window.open(externalUrl, "_blank", "noopener,noreferrer");
      if (newWin) {
        newWin.opener = null;
        return;
      }
    } catch (err) {
      console.warn("window.open blocked:", err);
    }

    // Method 2: Fallback to direct navigation
    window.location.href = externalUrl;
  };

  /* --------------------------------------------------------------
     Loading state
     -------------------------------------------------------------- */
  if (insideTikTok === null) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "50px",
          fontFamily: "'Comic Sans MS', Arial, sans-serif",
          color: "#333",
        }}
      >
        Checking browser…
      </div>
    );
  }

  /* --------------------------------------------------------------
     Inside TikTok → Show button
     -------------------------------------------------------------- */
  if (insideTikTok) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f8ff",
          textAlign: "center",
          padding: "20px",
          fontFamily: "'Comic Sans MS', Arial, sans-serif",
        }}
      >
        <img
          src="https://www9.0zz0.com/2024/04/06/13/548511907.gif"
          alt="Website Logo"
          style={{
            width: "250px",
            marginBottom: "40px",
            border: "4px solid #010101ff",
            borderRadius: "16px",
            backgroundColor: "#fff",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />

        <h1 style={{ fontSize: "28px", marginBottom: "16px", color: "#d62828" }}>
          Open in Real Browser
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "30px", color: "#333" }}>
          Tap the button below to view the full site!
        </p>

        <button
          onClick={openInRealBrowser}
          style={{
            padding: "16px 32px",
            fontSize: "20px",
            fontWeight: "bold",
            backgroundColor: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(255, 107, 107, 0.3)",
            transition: "all 0.2s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Open Site
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Or copy: <strong>welovemods.com</strong>
        </p>
      </div>
    );
  }

  /* --------------------------------------------------------------
     Should never reach here (auto-redirected)
     -------------------------------------------------------------- */
  return null;
};

export default G1;