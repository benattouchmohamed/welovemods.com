import React, { useEffect, useState } from "react";
import { Search, Download, ExternalLink, Globe, Gamepad2 } from "lucide-react";

const G1: React.FC = () => {
  const externalUrl = "https://welovemods.com/";

  const handleDirectAccess = () => {
    window.location.href = externalUrl;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        backgroundImage: "linear-gradient(180deg, #ffffff 0%, #f0f2f5 100%)",
        textAlign: "center",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#1a1a1a",
      }}
    >
      {/* Header Logo Section */}
      <div style={{ marginTop: "20px", marginBottom: "30px" }}>
        <img
          src="https://www9.0zz0.com/2024/04/06/13/548511907.gif"
          alt="Logo"
          style={{ 
            width: "160px", 
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
          }}
        />
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "8px" }}>
        Ready to Play?
      </h2>
      <p style={{ color: "#666", marginBottom: "25px", fontSize: "15px" }}>
        Follow these steps to get your favorite mods
      </p>

      {/* PRIMARY ACTION BUTTON */}
      <button
        onClick={handleDirectAccess}
        style={{
          backgroundColor: "#ff0050",
          color: "white",
          padding: "18px 32px",
          borderRadius: "16px",
          border: "none",
          fontWeight: "bold",
          fontSize: "17px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          maxWidth: "360px",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(255, 0, 80, 0.25)",
          marginBottom: "40px",
          transition: "transform 0.2s active"
        }}
      >
        <ExternalLink size={22} /> CLICK FOR DIRECT ACCESS
      </button>

      <div style={{ width: "100%", maxWidth: "420px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ height: "1px", flex: 1, backgroundColor: "#ddd" }}></div>
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#aaa", textTransform: "uppercase" }}>Or Manual Search</span>
          <div style={{ height: "1px", flex: 1, backgroundColor: "#ddd" }}></div>
        </div>

        {/* STEP 1 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Globe size={14} /> Step 1</div>
          </div>
          <p style={textStyle}>Open your browser and search for <span style={{ color: "#ff0050", fontWeight: "700" }}>welovemods.com</span> on Google</p>
          <img src="/images/welovemods.comgooglle.png" alt="Search Google" style={imageStyle} />
        </div>

        {/* STEP 2 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Search size={14} /> Step 2</div>
          </div>
          <p style={textStyle}>Click on the <span style={{ fontWeight: "700" }}>Search result</span> to enter the site</p>
          <img src="/images/resultat.png" alt="Select Result" style={imageStyle} />
        </div>

        {/* STEP 3 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Gamepad2 size={14} /> Step 3</div>
          </div>
          <p style={textStyle}>Type your <span style={{ fontWeight: "700" }}>Game Name</span> in the search bar</p>
          <img src="/images/heer.png" alt="Search Game" style={imageStyle} />
        </div>

        {/* STEP 4 */}
        <div style={cardStyle}>
          <div style={stepHeader}>
            <div style={badgeStyle}><Download size={14} /> Step 4</div>
          </div>
          <p style={textStyle}>Tap <span style={{ fontWeight: "700" }}>Download</span> and enjoy your game!</p>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
             <div style={{ backgroundColor: "#e6fffa", padding: "15px", borderRadius: "50%" }}>
                <Download size={40} color="#00b894" />
             </div>
          </div>
        </div>
      </div>

      <footer style={{ padding: "40px 0", color: "#ccc", fontSize: "12px" }}>
        &copy; 2026 WeLoveMods • Safe & Secure
      </footer>
    </div>
  );
};

/* --- Modern UI Styles --- */

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "24px",
  marginBottom: "20px",
  border: "1px solid rgba(0,0,0,0.03)",
  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
};

const stepHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px"
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#f0f2f5",
  color: "#555",
  padding: "6px 12px",
  borderRadius: "10px",
  fontSize: "12px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

const textStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.5",
  marginBottom: "12px",
  color: "#444"
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid #f0f0f0",
  marginTop: "5px"
};

export default G1;