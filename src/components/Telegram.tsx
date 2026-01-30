import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";

interface TelegramProps {
  onUserAction?: (callback: (action: string, gameName: string) => void) => void;
}

const Telegram = forwardRef<HTMLDivElement, TelegramProps>((props, ref) => {
  const [country, setCountry] = useState<string>("Unknown");
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || "7912646322:AAFaxiD7bfPj9dn35_kLep_YGfr5PyvrSZE";
  const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID || "6180902575";

  // Fetch user's IP and country
  useEffect(() => {
    const fetchIpAndCountry = async () => {
      try {
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        const ip = ipResponse.data.ip;
        setIpAddress(ip);

        const countryResponse = await axios.get("https://ipapi.co/json/");
        setCountry(countryResponse.data.country_name || "Unknown");
      } catch (error) {
        console.error("Error fetching IP or country:", error);
      }
    };
    fetchIpAndCountry();
  }, []);

  // Handle sending Telegram message only once per IP
  const sendTelegramMessage = async (action: string, gameName: string) => {
    if (!ipAddress) return;

    const sentIps = JSON.parse(localStorage.getItem("sentIps") || "[]") as string[];
    if (sentIps.includes(ipAddress)) return;

    const message = `New User Action!\nGame: ${gameName}\nAction: ${action}\nCountry: ${country}\nIP: ${ipAddress}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
      });
      console.log("Message sent:", response.data);

      // Add IP to localStorage after successful send
      sentIps.push(ipAddress);
      localStorage.setItem("sentIps", JSON.stringify(sentIps));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Listen for user actions from parent component
  useEffect(() => {
    if (props.onUserAction) {
      props.onUserAction((action: string, gameName: string) => {
        sendTelegramMessage(action, gameName);
      });
    }
  }, [props.onUserAction]);

  return (
    <div ref={ref} className="p-4 hidden">
      <h2 className="text-2xl font-bold text-cartoon-green">Telegram Notification</h2>
      <p className="text-cartoon-blue">Monitoring user actions...</p>
    </div>
  );
});

export default Telegram;
