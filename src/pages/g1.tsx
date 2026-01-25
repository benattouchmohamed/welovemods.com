import React, { useEffect, useState } from "react";
import { Search, Download, Globe, Gamepad2, Copy, Check } from "lucide-react";

const G1: React.FC = () => {
  const [isTikTokBrowser, setIsTikTokBrowser] = useState(false);
  const [copied, setCopied] = useState(false);
  const displayUrl = "welovemods.com";           // shown / copied (clean)
  const fullUrl = "https://welovemods.com/";     // used for redirect & alerts

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
    const isTikTok = /tiktok|TTWebView|BytedanceWebview/i.test(ua);

    setIsTikTokBrowser(isTikTok);

    // If NOT TikTok browser → auto redirect to full site
    if (!isTikTok) {
      // Small delay so the page can be seen briefly if someone opens dev tools etc.
      setTimeout(() => {
        window.location.href = fullUrl;
      }, 800); // 0.8 seconds — feels instant but safe
    }
  }, []);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isTikTokBrowser) {
      e.preventDefault();
      alert(
        "\n\nBest experience:\nCopy → " +
          displayUrl +
          "\nThen open in Chrome / Safari / normal browser."
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // If redirecting (normal browser), show a minimal loading state or nothing
  if (!isTikTokBrowser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fffaf0 0%, #ffe8d6 100%)",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <p style={{ fontSize: "1.4rem", color: "#ff6200", fontWeight: 700 }}>
          Redirecting to {displayUrl}...
        </p>
      </div>
    );
  }

  // TikTok browser → show the guide page
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: "linear-gradient(135deg, #fffaf0 0%, #ffe8d6 100%)",
        textAlign: "center",
        padding: "20px 15px",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#1a1a1a",
      }}
    >
      {isTikTokBrowser && (
        <div
          style={{
            backgroundColor: "#fff0e6",
            color: "#c2410c",
            padding: "16px 24px",
            borderRadius: "20px",
            marginBottom: "30px",
            maxWidth: "500px",
            fontSize: "15px",
            border: "1px solid #ffccb3",
            boxShadow: "0 4px 14px rgba(255,140,66,0.15)",
          }}
        >
          
          For faster downloads & full features → open <strong>{displayUrl}</strong> in your regular browser (Chrome, Safari...).
        </div>
      )}

      <h1
        style={{
          fontSize: "2.6rem",
          fontWeight: 800,
          margin: "30px 0 12px",
          color: "#ff6200",
          letterSpacing: "-0.5px",
        }}
      >
        WeLoveMods
      </h1>

      <p
        style={{
          color: "#444",
          marginBottom: "40px",
          fontSize: "1.15rem",
          maxWidth: "480px",
        }}
      >
        Guide to get your mod game — just follow the steps!
      </p>

      {/* Big Copy Domain Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "60px",
          padding: "14px 28px",
          marginBottom: "50px",
          boxShadow: "0 8px 24px rgba(255,98,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          maxWidth: "100%",
          border: "2px solid #ff8c42",
        }}
      >
        <Globe size={24} color="#ff6200" />
        <span
          style={{
            fontWeight: 700,
            color: "#222",
            fontSize: "1.15rem",
          }}
        >
          {displayUrl}
        </span>
        <button
          onClick={copyToClipboard}
          style={{
            backgroundColor: copied ? "#22c55e" : "#ff6200",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {copied ? <Check size={24} /> : <Copy size={24} />}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "520px", textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "40px 0 32px",
          }}
        >
          <div
            style={{
              height: "3px",
              flex: 1,
              background: "linear-gradient(to right, #ff6200, #ffb74d)",
            }}
          />
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#ff6200",
              textTransform: "uppercase",
              letterSpacing: "1.2px",
            }}
          >
            Easy Steps
          </span>
          <div
            style={{
              height: "3px",
              flex: 1,
              background: "linear-gradient(to left, #ff6200, #ffb74d)",
            }}
          />
        </div>

        {/* Regular Step Cards */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={{ ...badgeStyle, backgroundColor: "#fff5f0", color: "#ff6200" }}>
              <Globe size={18} /> 1
            </div>
          </div>
          <p style={textStyle}>
            Google <span style={{ color: "#ff6200", fontWeight: 700 }}>welovemods.com</span>
          </p>
          <img src="/images/welovemods.comgooglle.png" alt="Google search" style={imageStyle} />
        </div>

        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={{ ...badgeStyle, backgroundColor: "#fff5f0", color: "#ff6200" }}>
              <Search size={18} /> 2
            </div>
          </div>
          <p style={textStyle}>
            Click the <span style={{ fontWeight: 700, color: "#ff6200" }}>top result</span>
          </p>
          <img src="/images/resultat.png" alt="First result" style={imageStyle} />
        </div>

        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={{ ...badgeStyle, backgroundColor: "#fff5f0", color: "#ff6200" }}>
              <Gamepad2 size={18} /> 3
            </div>
          </div>
          <p style={textStyle}>Search your game name in the bar</p>
          <img src="/images/heer.png" alt="Game search" style={imageStyle} />
        </div>

        {/* Grand / Alternative Method Card with BIG GIF */}
        <div
          style={{
            ...cardStyle,
            minHeight: "520px",
            padding: "32px 24px",
            background: "linear-gradient(135deg, #ffffff 0%, #fff8f2 100%)",
            border: "2px solid #ff8c42",
            boxShadow: "0 12px 32px rgba(255,98,0,0.18)",
          }}
        >
          <div style={stepHeader}>
            <div style={{ ...badgeStyle, backgroundColor: "#fff5f0", color: "#ff6200" }}>
              <Download size={18} /> 4 — Alternative Fast Way!
            </div>
          </div>
          <p style={{ ...textStyle, fontSize: "1.1rem", fontWeight: 600 }}>
            Choose mod → tap <span style={{ color: "#ff6200" }}>Download</span> → ready to play!
          </p>

          <div
            style={{
              margin: "40px 0",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <p
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#ff6200",
                margin: 0,
                letterSpacing: "1px",
              }}
            >
              OR JUST FOLLOW THIS BIG GUIDE ↓
            </p>
            <img
              src="https://www9.0zz0.com/2024/04/06/13/548511907.gif"
              alt="WeLoveMods Big Animated Guide"
              style={{
                width: "100%",
                maxWidth: "360px",
                borderRadius: "28px",
                boxShadow: "0 16px 40px rgba(255,98,0,0.25)",
                border: "4px solid #ff6200",
              }}
            />
          </div>
        </div>
      </div>

      <footer
        style={{
          padding: "100px 0 60px",
          color: "#666",
          fontSize: "1rem",
          textAlign: "center",
        }}
      >
        © 2026 WeLoveMods • Safe & Exciting Game Mods
      </footer>
    </div>
  );
};

/* Styles remain the same */
const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "28px",
  borderRadius: "28px",
  marginBottom: "28px",
  border: "1px solid rgba(255,140,66,0.15)",
  boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
};

const stepHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  marginBottom: "24px",
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#fff5f0",
  color: "#ff6200",
  padding: "10px 20px",
  borderRadius: "999px",
  fontSize: "1rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const textStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  lineHeight: 1.6,
  marginBottom: "24px",
  color: "#222",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "20px",
  border: "1px solid #ffe0cc",
  marginTop: "16px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};

export default G1;