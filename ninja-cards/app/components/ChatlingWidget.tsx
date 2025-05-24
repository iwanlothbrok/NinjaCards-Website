'use client';

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function ChatlingWidget() {
  const [showChatling, setShowChatling] = useState(false);
  const chatbotId = process.env.NEXT_PUBLIC_CHATLING_BOT_ID;
  const pathname = usePathname();

  useEffect(() => {
    // Hide widget if URL contains "profiledetails" (case-insensitive)
    if (pathname && pathname.toLowerCase().includes("profileDetails")) {
      setShowChatling(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowChatling(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!chatbotId || !showChatling) return null;

  return (
    <>
      <Script id="chatling-config" strategy="afterInteractive">
        {`window.chtlConfig = { chatbotId: "${chatbotId}", color: "#FFA500" };`}
      </Script>
      <Script
        src="https://chatling.ai/js/embed.js"
        strategy="afterInteractive"
        defer
      />
      <style jsx>{`
        .fade-bounce-in {
          animation: fadeBounceIn 1.2s ease forwards;
          opacity: 0;
        }

        @keyframes fadeBounceIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
