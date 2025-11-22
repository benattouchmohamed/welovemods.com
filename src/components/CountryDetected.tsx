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
      // All countries you want to redirect
      const redirectList = ["pk", "bd", "iq", "in", "vn", "my", "id", "ph"]; 
      let shouldRedirect = false;

      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const country = (data.country || "").toLowerCase();
        if (redirectList.includes(country)) shouldRedirect = true;
      } catch {
        try {
          const res = await fetch("https://get.geojs.io/v1/ip/country.json");
          const data = await res.json();
          const country = (data.country || "").toLowerCase();
          if (redirectList.includes(country)) shouldRedirect = true;
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
