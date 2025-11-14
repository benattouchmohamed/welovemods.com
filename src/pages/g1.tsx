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

  // Some TikTok browsers also inject a special property
  const hasTikTokProp =
    // @ts-ignore – TikTok injects this on Android
    (window as any).TikTokWebView !== undefined ||
    // @ts-ignore – iOS TikTok sometimes adds this
    (window as any).webkit?.messageHandlers?.TikTok !== undefined;

  const hasKeyword = tiktokKeywords.some((kw) => ua.includes(kw));

  return hasKeyword || hasTikTokProp;
};

const G1: React.FC = () => {
  const [insideTikTok, setInsideTikTok] = useState<boolean | null>(null);
  const externalUrl = "https://welovemods.com/";

  /* --------------------------------------------------------------
     Detect once on mount
     -------------------------------------------------------------- */
  useEffect(() => {
    const tikTok = isTikTokBrowser();
    setInsideTikTok(tikTok);

    // If NOT inside TikTok → open the site instantly
    if (!tikTok) {
      window.location.replace(externalUrl);
    }
  }, []);

  /* --------------------------------------------------------------
     Still detecting…
     -------------------------------------------------------------- */
  if (insideTikTok === null) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "50px",
          fontFamily: "'Comic Sans MS', Arial, sans-serif",
        }}
      >
        Checking browser…
      </div>
    );
  }

  /* --------------------------------------------------------------
     Inside TikTok → show button (no auto-redirect)
     -------------------------------------------------------------- */
  const openInRealBrowser = () => {
    try {
      const newWin = window.open(externalUrl, "_blank", "noopener,noreferrer");
      if (newWin) newWin.opener = null;
      else window.location.href = externalUrl;
    } catch {
      window.location.href = externalUrl;
    }
  };

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
        }}
      />

     <br />

           <h2
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#222",
        }}
      >
        welovemods.com
      </h2>

     

     
    </div>
  );
};

export default G1;