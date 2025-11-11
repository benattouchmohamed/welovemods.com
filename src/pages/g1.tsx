import React, { useEffect, useState } from "react";

/* --------------------------------------------------------------
   Helper: is TikTok in-app browser?
   -------------------------------------------------------------- */
const isTikTokBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();

  const tiktokKeywords = [
    "tiktok",
    "musical_ly",
    "musically",
    "zhiliaoapp",
    "com.zhiliaoapp.musically",
    "com.ss.android.ugc.aweme",
  ];

  const hasTikTokProp =
    (window as any).TikTokWebView !== undefined ||
    (window as any).webkit?.messageHandlers?.TikTok !== undefined;

  const hasKeyword = tiktokKeywords.some((kw) => ua.includes(kw));

  return hasKeyword || hasTikTokProp;
};

const G1: React.FC = () => {
  const [insideTikTok, setInsideTikTok] = useState<boolean | null>(null);
  const externalUrl = "https://welovemods.com/";

  useEffect(() => {
    const tikTok = isTikTokBrowser();
    setInsideTikTok(tikTok);

    if (!tikTok) {
      window.location.replace(externalUrl);
    }
  }, []);

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

      {/* ✅ Test message */}
      <div
        style={{
          fontSize: "22px",
          color: "#000",
          background: "#ffffff",
          padding: "16px 22px",
          borderRadius: "12px",
          border: "2px solid #000",
          maxWidth: "300px",
          lineHeight: "1.4",
        }}
      >
        ✅ <strong>Test:</strong>  
        Go to <strong>Google</strong> and search  
        <span style={{ color: "#0073ff" }}>
          <strong>welovemods.com</strong>
        </span>
      </div>

      {/* ✅ Scan Me + QR Code */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          background: "#ffffff",
          padding: "16px 22px",
          borderRadius: "12px",
          border: "2px solid #000",
          width: "260px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#000",
          }}
        >
          🔍 Scan Me
        </div>

        <img
          src="./images/qr.png"
          alt="Scan QR"
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "12px",
            border: "2px solid #000",
          }}
        />
      </div>
    </div>
  );
};

export default G1;
