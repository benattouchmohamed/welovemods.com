'use client';

import React, { useState, useEffect } from "react";
import { Check, AlertCircle, RefreshCw } from "lucide-react";

const AdBlue = () => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(4);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");

  const generateQuestion = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setUserAnswer("");
    setError("");
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const checkAnswer = () => {
    if (parseInt(userAnswer) === num1 + num2) {
      setVerified(true);
    } else {
      setError("Wrong answer. Try again!");
      generateQuestion();
    }
  };

  const completeVerification = () => {
    setLoading(true);
    window.open("https://smrturl.co/8cc57ec", "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setLoading(false);

      // redirect WITHOUT next/navigation
      setTimeout(() => {
        window.location.href = "/download";
      }, 2000);
    }, 1500);
  };

  // SUCCESS SCREEN
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-green-600 mb-3">
            Verified! You're Human
          </h1>
          <p className="text-gray-600 mb-8">Taking you back to download...</p>

          <button
            onClick={() => (window.location.href = "https://smrturl.co/8cc57ec")}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:brightness-110 transition shadow-lg"
          >
            Continue to Download
          </button>
        </div>
      </div>
    );
  }

  // MAIN SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-black text-blue-700 mb-2">
          Complete This to Prove You're Human
        </h1>
        <p className="text-gray-600 text-sm mb-8">Quick 2-step verification</p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-xl font-bold text-blue-800 mb-4">
            What is {num1} + {num2}?
          </p>

          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
            className="w-full text-center text-2xl font-bold py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 outline-none transition"
            placeholder="?"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm mt-3 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={checkAnswer}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Submit Answer
          </button>

          <button
            onClick={generateQuestion}
            className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={completeVerification}
          disabled={loading || !verified}
          className={`w-full py-4 rounded-xl font-black text-white text-lg transition-all
            ${loading || !verified
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 shadow-xl active:scale-95"
            }`}
        >
          {loading ? "Opening Verification..." : "Complete Final Step →"}
        </button>

        <p className="text-xs text-gray-500 mt-6">
          This helps us keep bots away • Opens in new tab
        </p>
      </div>
    </div>
  );
};

export default AdBlue;
