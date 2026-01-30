import React, { useEffect, useState } from "react";
import { Search, Download, Globe, Gamepad2, Copy, Check } from "lucide-react";

const G1: React.FC = () => {
  const [isTikTokBrowser, setIsTikTokBrowser] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const displayUrl = "welovemods.com"; 
  const fullUrl = "https://welovemods.com/";

  useEffect(() => {
    // Detect TikTok / Instagram / Facebook in-app browsers
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
    const isTikTok = /tiktok|TTWebView|BytedanceWebview|FBAN|FBAV|Instagram/i.test(ua);
    
    setIsTikTokBrowser(isTikTok);

    // If NOT in an app browser -> Redirect to the main site
    if (!isTikTok) {
      const timer = setTimeout(() => {
        window.location.href = fullUrl;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(displayUrl);
      } else {
        // Fallback for older mobile browsers
        const textArea = document.createElement("textarea");
        textArea.value = displayUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // REDIRECT VIEW (For Chrome/Safari users)
  if (!isTikTokBrowser) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={spinnerStyle}></div>
          <p style={{ fontSize: "1.4rem", color: "#ff6200", fontWeight: 700, marginTop: "20px" }}>
            Redirecting to {displayUrl}...
          </p>
        </div>
      </div>
    );
  }

  // GUIDE VIEW (For TikTok users)
  return (
    <div style={containerStyle}>
      {/* Top Alert Notification */}
      <div style={alertStyle}>
        For faster downloads & full features → open <strong>{displayUrl}</strong> in your regular browser (Chrome, Safari).
      </div>

      <h1 style={titleStyle}>WeLoveMods</h1>
      
      <p style={subtitleStyle}>
        Follow these steps to get your modded games safely!
      </p>

      {/* Copyable Domain Bar */}
      <div style={searchBarStyle}>
        <Globe size={24} color="#ff6200" />
        <span style={domainTextStyle}>{displayUrl}</span>
        <button onClick={copyToClipboard} style={{ ...copyButtonStyle, backgroundColor: copied ? "#22c55e" : "#ff6200" }}>
          {copied ? <Check size={24} /> : <Copy size={24} />}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div style={dividerContainer}>
          <div style={lineStyle} />
          <span style={dividerText}>Easy Steps</span>
          <div style={lineStyle} />
        </div>

        {/* Step 1 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Globe size={18} /> 1</div>
          </div>
          <p style={textStyle}>Open Chrome/Safari and type <span style={{ color: "#ff6200", fontWeight: 700 }}>{displayUrl}</span></p>
          <img src="/images/welovemods.comgooglle.png" alt="Step 1" style={imageStyle} />
        </div>

        {/* Step 2 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Search size={18} /> 2</div>
          </div>
          <p style={textStyle}>Click the <span style={{ fontWeight: 700, color: "#ff6200" }}>top result</span> in Google</p>
          <img src="/images/resultat.png" alt="Step 2" style={imageStyle} />
        </div>

        {/* Step 3 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Gamepad2 size={18} /> 3</div>
          </div>
          <p style={textStyle}>Search for your favorite game</p>
          <img src="/images/heer.png" alt="Step 3" style={imageStyle} />
        </div>

        {/* Alternative Step 4 */}
        <div style={{ ...cardStyle, border: "2px solid #ff8c42", boxShadow: "0 12px 32px rgba(255,98,0,0.18)" }}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Download size={18} /> 4</div>
          </div>
          <p style={textStyle}>Tap <span style={{ color: "#ff6200", fontWeight: 700 }}>Download</span> and enjoy!</p>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
             <p style={guideReminder}>OR FOLLOW THE ANIMATED GUIDE ↓</p>
             <img 
               src="https://www9.0zz0.com/2024/04/06/13/548511907.gif" 
               alt="Video Guide" 
               style={gifStyle} 
             />
          </div>
        </div>
      </div>

      <footer style={footerStyle}>
        © 2026 WeLoveMods • Safe & Exciting Game Mods
      </footer>
    </div>
  );
};

// --- STYLES OBJECTS ---

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  backgroundImage: "linear-gradient(135deg, #fffaf0 0%, #ffe8d6 100%)",
  padding: "20px 15px",
  fontFamily: "'Inter', system-ui, sans-serif",
  color: "#1a1a1a",
};

const alertStyle: React.CSSProperties = {
  backgroundColor: "#fff0e6",
  color: "#c2410c",
  padding: "16px 24px",
  borderRadius: "20px",
  marginBottom: "30px",
  maxWidth: "500px",
  fontSize: "15px",
  border: "1px solid #ffccb3",
  boxShadow: "0 4px 14px rgba(255,140,66,0.15)",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.6rem",
  fontWeight: 800,
  margin: "30px 0 12px",
  color: "#ff6200",
  letterSpacing: "-0.5px",
};

const subtitleStyle: React.CSSProperties = {
  color: "#444",
  marginBottom: "40px",
  fontSize: "1.15rem",
  maxWidth: "480px",
  textAlign: "center",
};

const searchBarStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "60px",
  padding: "10px 10px 10px 28px",
  marginBottom: "50px",
  boxShadow: "0 8px 24px rgba(255,98,0,0.12)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  width: "100%",
  maxWidth: "400px",
  border: "2px solid #ff8c42",
  justifyContent: "space-between",
};

const domainTextStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#222",
  fontSize: "1.15rem",
};

const copyButtonStyle: React.CSSProperties = {
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
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "28px",
  marginBottom: "28px",
  border: "1px solid rgba(255,140,66,0.15)",
  boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#fff5f0",
  color: "#ff6200",
  padding: "8px 16px",
  borderRadius: "999px",
  fontSize: "0.9rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const stepHeader: React.CSSProperties = {
  display: "flex",
  marginBottom: "16px",
};

const textStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  lineHeight: 1.5,
  color: "#222",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "16px",
  marginTop: "16px",
  border: "1px solid #eee",
};

const gifStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "320px",
  borderRadius: "20px",
  border: "3px solid #ff6200",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const dividerContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  margin: "20px 0 30px",
};

const lineStyle: React.CSSProperties = {
  height: "2px",
  flex: 1,
  background: "#ffccb3",
};

const dividerText: React.CSSProperties = {
  fontWeight: 800,
  color: "#ff6200",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const guideReminder: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 800,
  color: "#ff6200",
  marginBottom: "15px",
};

const footerStyle: React.CSSProperties = {
  padding: "60px 0",
  color: "#888",
  fontSize: "0.9rem",
};

const spinnerStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  border: "5px solid #fff",
  borderTop: "5px solid #ff6200",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

export default G1;
