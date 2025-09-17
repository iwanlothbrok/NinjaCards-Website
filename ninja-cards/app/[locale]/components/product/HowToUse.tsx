"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { FaExpand, FaCompress, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";

const HowToUse = () => {
  const t = useTranslations("howToUse");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync fullscreen state with screenfull
  useEffect(() => {
    if (screenfull.isEnabled) {
      const handler = () => setIsFullscreen(screenfull.isFullscreen);
      screenfull.on("change", handler);
      return () => screenfull.off("change", handler);
    }
  }, []);

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  return (
    <section className="py-6 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-center mb-12 text-orange-500">
          {t("title")}
        </h2>

        {/* Content Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Player */}
          <div
            ref={containerRef}
            className={`relative rounded-lg overflow-hidden shadow-lg border border-gray-800 p-2 flex justify-center items-center ${isFullscreen ? "fixed inset-0 bg-black z-50" : ""
              }`}
            style={{
              backgroundColor: "#000",
              height: isFullscreen ? "100vh" : "400px",
              width: "100%",
            }}
          >
            <ReactPlayer
              url="https://www.youtube.com/embed/vlpRHfQ-W3E"
              controls
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              width="100%"
              height="100%"
              className="rounded-lg"
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                  },
                },
              }}
            />

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-gray-700 text-white rounded-md p-2 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              aria-label={isFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
            >
              {isFullscreen ? (
                <FaCompress className="text-xl" />
              ) : (
                <FaExpand className="text-xl" />
              )}
            </button>

            {/* Close Fullscreen */}
            {isFullscreen && (
              <button
                onClick={() => screenfull.exit()}
                className="absolute top-4 left-4 bg-red-600 text-white rounded-md p-3 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label={t("exitFullscreen")}
              >
                <FaTimes className="text-2xl" />
              </button>
            )}
          </div>

          {/* Text Section */}
          <div>
            <p className="text-lg leading-relaxed mb-6 text-gray-300">
              {t("intro")}
            </p>

            <div className="space-y-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-start space-x-4">
                  <div className="text-orange text-2xl font-bold">{step}.</div>
                  <p className="text-md text-gray-300">{t(`steps.${step}`)}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-md text-gray-300">{t("outro")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
