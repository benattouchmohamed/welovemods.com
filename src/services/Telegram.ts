import axios from "axios";

interface SendTelegramMessageProps {
  ip: string;
  country: string;
  gameTitle: string;
  botToken?: string;
  chatId?: string;
}

/**
 * Send a Telegram message about user download.
 * Only sends once per IP stored in localStorage.
 */
export const sendTelegramMessage = async ({
  ip,
  country,
  gameTitle,
  botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || "",
  chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID || "",
}: SendTelegramMessageProps) => {
  if (!ip || !gameTitle || !botToken || !chatId) {
    console.log("Missing required data to send Telegram message", { ip, gameTitle });
    return;
  }

  try {
    const sentIps = JSON.parse(localStorage.getItem("sentIps") || "[]") as string[];
    if (sentIps.includes(ip)) {
      console.log("Telegram message already sent for this IP:", ip);
      return;
    }

    const message = `🎮 New User Action!\nGame: ${gameTitle}\nAction: Download Clicked\nCountry: ${country}\nIP: ${ip}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await axios.post(url, { chat_id: chatId, text: message });
    console.log("Telegram message sent successfully:", response.data);

    // Save IP to localStorage
    sentIps.push(ip);
    localStorage.setItem("sentIps", JSON.stringify(sentIps));
  } catch (error: any) {
    console.error("Error sending Telegram message:", error.response?.data || error.message);
  }
};
