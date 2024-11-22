import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull"; // For fullscreen functionality
import { FaExpand, FaCompress, FaTimes } from "react-icons/fa";

const HowToUse = () => {
  const containerRef = useRef(null); // Reference for fullscreen functionality
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
      setIsFullscreen(!isFullscreen);
    }
  };

  // Exit fullscreen mode
  const exitFullscreen = () => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      screenfull.exit();
      setIsFullscreen(false);
    }
  };

  return (
    <section className="py-16 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-center mb-12 text-orange-500">
          Как да използвате нашите NFC Ninja Карти?
        </h2>

        {/* Content Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Player Section */}
          <div
            ref={containerRef}
            className={`relative rounded-lg overflow-hidden shadow-lg border border-gray-800 p-2 flex justify-center items-center ${isFullscreen ? "fixed inset-0 bg-black z-50" : ""}`}
            style={{
              backgroundColor: "#000",
              height: isFullscreen ? "100vh" : "400px",
              width: isFullscreen ? "100%" : "100%",
            }}
          >
            <ReactPlayer
              url="https://www.youtube.com/embed/vlpRHfQ-W3E"
              controls
              width="100%"
              height="100%"
              className="rounded-lg"
              playing
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    playsinline: 1,
                    showinfo: 0,
                    rel: 0,
                  },
                },
              }}
            />

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`absolute top-4 right-4 bg-gray-700 text-white rounded-md p-2 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${isFullscreen ? "hidden" : ""}`}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <FaCompress className="text-xl" /> : <FaExpand className="text-xl" />}
            </button>

            {/* Close Fullscreen Button */}
            {isFullscreen && (
              <button
                onClick={exitFullscreen}
                className="absolute top-4 left-4 bg-red-600 text-white rounded-md p-3 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Exit Fullscreen"
              >
                <FaTimes className="text-2xl" />
              </button>
            )}
          </div>

          {/* Text Section */}
          <div>
            <p className="text-lg leading-relaxed mb-6 text-gray-300">
              Открийте нов начин за споделяне на вашите контакти с нашите NFC Ninja Карти. Ето как работят:
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-orange text-2xl font-bold">1.</div>
                <p className="text-md text-gray-300">
                  Сканирайте вашата карта с помощта на инструкциите от видеото за бърза настройка.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-orange text-2xl font-bold">2.</div>
                <p className="text-md text-gray-300">
                  Докоснете вашия NFC карта до съвместим телефон и споделяйте информация за секунди.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-orange text-2xl font-bold">3.</div>
                <p className="text-md text-gray-300">
                  Създайте персонализиран профил, който ви представя по уникален начин.
                </p>
              </div>
            </div>

            <p className="mt-8 text-md text-gray-300">
              Вашите контакти никога няма да изглеждат същите. Поръчайте NFC Ninja Карти днес и
              впечатлете на всяка среща!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
