'use client';

import React, { memo, useState } from "react";

/* ────────────────────── FULLSCREEN IFRAME WITH REAL LOADING INDICATOR ────────────────────── */
const IframeWithLoading = memo(() => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Subtle Professional Loading Overlay - disappears when iframe loads */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-white">
          <div className="professional-loader"></div>
        </div>
      )}

      {/* Real iframe */}
      <iframe
        src="https://appinstallcheck.com/cl/i/8dkk3k"
        title="Content"
        className="flex-1 w-full relative z-10"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}  // Hide loader when iframe actually finishes loading
      />
    </div>
  );
});

/* ────────────────────── STYLES WITH PROFESSIONAL SUBTLE LOADING EFFECT ────────────────────── */
const SimpleStyles = () => (
  <style>{`
    /* Professional subtle loading spinner */
    .professional-loader {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(59, 130, 246, 0.2);
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      opacity: 0.8;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Soft pulse glow */
    .professional-loader::before {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
  `}</style>
);

/* ────────────────────── MAIN COMPONENT ────────────────────── */
const Download = () => {
  return (
    <>
      <SimpleStyles />
      <IframeWithLoading />
    </>
  );
};

export default Download;