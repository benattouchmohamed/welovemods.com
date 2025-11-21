'use client';

import { useEffect } from "react";

const CountryDetected = () => {
  useEffect(() => {
    if (sessionStorage.getItem("geoChecked") === "done") return;

    if (typeof window !== "undefined" && window.location.pathname.includes("adblue")) {
      sessionStorage.setItem("geoChecked", "done");
      return;
    }

    const checkCountry = async () => {
      const redirectList = ["ph", "id", ]; // ← Morocco added here
      let shouldRedirect = false;

      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (redirectList.includes((data.country || "").toLowerCase())) {
          shouldRedirect = true;
        }
      } catch {
        try {
          const res = await fetch("https://get.geojs.io/v1/ip/country.json");
          const data = await res.json();
          if (redirectList.includes((data.country || "").toLowerCase())) {
            shouldRedirect = true;
          }
        } catch {}
      }

      sessionStorage.setItem("geoChecked", "done");
      if (shouldRedirect) window.location.replace("/adblue");
    };

    checkCountry();
  }, []);

  return null;
};

export default CountryDetected;
