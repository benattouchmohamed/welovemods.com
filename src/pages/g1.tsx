import React, { useEffect, useState } from "react";

/* --------------------------------------------------------------
   Detect TikTok in-app browser
   -------------------------------------------------------------- */
const isTikTokBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  const keywords = [
    "tiktok",
    "musical_ly",
    "musically",
    "zhiliaoapp",
    "com.zhiliaoapp.musically",
    "com.ss.android.ugc.aweme",
  ];
  const hasProp =
    (window as any).TikTokWebView !== undefined ||
    (window as any).webkit?.messageHandlers?.TikTok !== undefined;

  return keywords.some((k) => ua.includes(k)) || hasProp;
};

const G1: React.FC = () => {
  const [isTikTok, setIsTikTok] = useState<boolean | null>(null);
  const siteUrl = "https://welovemods.com/";

  /* --------------------------------------------------------------
     Detect once on mount
     -------------------------------------------------------------- */
  useEffect(() => {
    const inside = isTikTokBrowser();
    setIsTikTok(inside);

    if (!inside) {
      window.location.replace(siteUrl);
    }
  }, []);

  /* --------------------------------------------------------------
     Open in real browser
     -------------------------------------------------------------- */
  const openSite = () => {
    try {
      const win = window.open(siteUrl, "_blank", "noopener,noreferrer");
      if (win) win.opener = null;
      else window.location.href = siteUrl;
    } catch {
      window.location.href = siteUrl;
    }
  };

  /* --------------------------------------------------------------
     Copy URL
     -------------------------------------------------------------- */
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      alert("Copied: welovemods.com");
    } catch {
      prompt("Copy this:", siteUrl);
    }
  };

  /* --------------------------------------------------------------
     Loading
     -------------------------------------------------------------- */
  if (isTikTok === null) {
    return (
      <div style={styles.center}>
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  /* --------------------------------------------------------------
     Inside TikTok → Show buttons
     -------------------------------------------------------------- */
  if (isTikTok) {
    return (
      <div style={styles.container}>
        <img
          src="https://www9.0zz0.com/2024/04/06/13/548511907.gif"
          alt="Logo"
          style={styles.logo}
        />

        <h1 style={styles.title}>View Full Site</h1>
        <p style={styles.subtitle}>
          Tap below to open in your browser
        </p>

        {/* Open Site Button */}
        <button onClick={openSite} style={styles.btnPrimary}>
          Open in Browser
        </button>

        {/* Copy URL Button */}
        <button onClick={copyUrl} style={styles.btnSecondary}>
          Copy URL
        </button>

        <p style={styles.footer}>
          Or paste in Safari/Chrome: <strong>welovemods.com</strong>
        </p>
      </div>
    );
  }

  return null; // Auto-redirected
};

/* --------------------------------------------------------------
   Styles (inline, clean, mobile-friendly)
   -------------------------------------------------------------- */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    color: "#fff",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f9fa",
  },
  logo: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    border: "6px solid rgba(255,255,255,0.3)",
    marginBottom: "30px",
    objectFit: "cover",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 12px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "32px",
    opacity: 0.9,
  },
  btnPrimary: {
    background: "#fff",
    color: "#667eea",
    border: "none",
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "50px",
    cursor: "pointer",
    marginBottom: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "all 0.2s",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.4)",
    padding: "14px 36px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "50px",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s",
  },
  footer: {
    marginTop: "30px",
    fontSize: "14px",
    opacity: 0.8,
  },
  text: {
    fontSize: "18px",
    color: "#555",
  },
};

/* Add hover/tap effects */
const btnHover = {
  transform: "translateY(-2px)",
  boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
};

export default G1;