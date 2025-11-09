import React, { useEffect, useState } from "react";

const G1: React.FC = () => {
  const [isTikTok, setIsTikTok] = useState<boolean | null>(null);
  const externalUrl = "https://welovemods.com/";

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
    const tiktok = /TikTok|musically|zhiliaoapp|com\.zhiliaoapp/i.test(ua);
    setIsTikTok(tiktok);

    // Auto redirect if NOT TikTok
    if (!tiktok) {
      const delayMs = 300;
      setTimeout(() => {
        window.location.replace(externalUrl);
      }, delayMs);
    }
  }, []);

  if (isTikTok === null) {
    // still detecting
    return <div style={{ textAlign: "center", paddingTop: "50px" }}>Checking browser...</div>;
  }

  // If not TikTok, we redirect automatically, so this renders only inside TikTok
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
          marginBottom: "20px",
          border: "4px solid #ffd700",
          borderRadius: "16px",
          backgroundColor: "#fff",
          padding: "10px",
        }}
      />

      <p
        style={{
          fontSize: "20px",
          color: "#333",
          backgroundColor: "#ffe4e1",
          padding: "15px",
          borderRadius: "12px",
          border: "2px solid #ff69b4",
          maxWidth: "400px",
          marginBottom: "25px",
        }}
      >
        <strong>Please click the button below to open in your browser and download the games.</strong>
      </p>

      <button
        onClick={() => {
          try {
            const newWin = window.open(externalUrl, "_blank", "noopener,noreferrer");
            if (newWin) newWin.opener = null;
            else window.location.href = externalUrl;
          } catch {
            window.location.href = externalUrl;
          }
        }}
        style={{
          backgroundColor: "#ffcc00",
          color: "#333",
          border: "none",
          padding: "12px 25px",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Open in Browser
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#d0f0c0",
          padding: "10px 20px",
          borderRadius: "30px",
          gap: "8px",
          fontSize: "14px",
          border: "2px solid #32cd32",
          marginTop: "18px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#32cd32"
          strokeWidth="2"
          style={{ width: "20px", height: "20px" }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span style={{ color: "#32cd32", fontWeight: "bold" }}>Secure</span>
        <span style={{ color: "#32cd32" }}>•</span>
        <span style={{ color: "#228b22", fontWeight: "bold" }}>Verified by Play Protect</span>
      </div>

      <p style={{ fontSize: "13px", color: "#666", marginTop: "12px" }}>
        Detected TikTok in-app browser — tap the button to open in your device browser.
      </p>
    </div>
  );
};

export default G1;
