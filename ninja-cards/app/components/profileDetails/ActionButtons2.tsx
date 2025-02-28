import React, { useCallback } from 'react';
import { FaCamera, FaPhoneAlt, FaShareAlt } from 'react-icons/fa';
import { User } from '@/types/user';
import { BASE_API_URL } from '@/utils/constants';
import html2canvas from 'html2canvas';


const buttonStyles = "flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 w-full sm:w-auto";

const ActionButtons2: React.FC<{ user: User | null }> = ({ user }) => {


    const captureScreenshot = useCallback(async () => {
        const element = document.querySelector('#profile-content') as HTMLElement;
        if (!element) {
            console.error("Element with id 'profile-content' not found.");
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 2,
                scrollX: -window.scrollX,
                scrollY: -window.scrollY,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });

            const image = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = image;
            link.download = `${user?.name || "profile"}_screenshot.png`;

            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                alert(`
                    📲 За да запазите изображението в галерията:
                    1. Отидете в раздела за изтегляния на Chrome или Safari.
                    2. Изберете снимката, която сте изтеглили.
                    3. Натиснете бутона долу в ляво.
                    4. Изберете "Добави в Снимки" или "Запази изображението".
                `);
            }
        } catch (error) {
            console.error('Error capturing screenshot:', error);
        }
    }, [user]);

    if (!user) return null;

    return (
        <>
            <button
                onClick={() => window.location.href = `tel:${user.phone1}`}
                className={`${buttonStyles} focus:ring-teal-500 focus:ring-opacity-50`}
            >
                <FaPhoneAlt className="mr-3 text-xl text-teal-600" />
                <span className="text-xl font-semibold">Обади се</span>
            </button>

            <button
                onClick={() => {
                    if (user.id) {
                        fetch(`${BASE_API_URL}/api/dashboard/incrementProfileShares`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id }),
                        }).catch((error) => console.error('Failed to increment profile shares:', error));
                    }

                    if (navigator.share) {
                        navigator
                            .share({
                                title: user.name || "Share Contact",
                                text: `Contact ${user.name || "User"}`,
                                url: window.location.href,
                            })
                            .catch((error) => console.error('Error with navigator.share:', error));
                    } else {
                        console.log('Share API is not supported in this browser.');
                    }
                }}
                className={`${buttonStyles} focus:ring-blue-600 focus:ring-opacity-50 mt-4`}
            >
                <FaShareAlt className="mr-3 text-xl text-blue-600" />
                <span className="text-xl font-semibold">Сподели Контант</span>
            </button>

            <button
                onClick={captureScreenshot}
                className={`${buttonStyles} focus:ring-blue-600 focus:ring-opacity-50 mt-4`}
            >
                <FaCamera className="mr-3 text-xl text-orange" />
                <span className="text-xl bg-white font-semibold">Екранна Снимка</span>
            </button>
        </>
    );
};

export default ActionButtons2;
