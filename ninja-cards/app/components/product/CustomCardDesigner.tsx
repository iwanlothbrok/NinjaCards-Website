import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { BASE_API_URL } from '@/utils/constants';
interface Alert {
    message: string;
    title: string;
    color: string;
}

type CardProps = {
    back: string;
    front: string;
    color: string;
};

const CustomCardDesigner: React.FC<CardProps> = ({ back, front, color }) => {
    const [qrCodeData, setQrCodeData] = useState<string>('https://example.com');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [name, setName] = useState<string>('Вашето име');
    const [title, setTitle] = useState<string>('Вашата фирма');
    const [backLogoUrl, setBackLogoUrl] = useState<string | null>(null);
    const [fontSizeName, setFontSizeName] = useState<number>(28);
    const [fontSizeTitle, setFontSizeTitle] = useState<number>(22);
    const [backLogoSize, setBackLogoSize] = useState<number>(240);
    const frontCanvasRef = useRef<HTMLCanvasElement>(null);
    const backCanvasRef = useRef<HTMLCanvasElement>(null);
    const [frontImage, setFrontImage] = useState<HTMLImageElement | null>(null);
    const [backImage, setBackImage] = useState<HTMLImageElement | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');
    const [courierIsSpeedy, setCourierIsSpeedy] = useState(1); // 1 for Speedy by default
    const [courierAddress, setCourierAddress] = useState('');
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const parseBase64ToPNG = (base64String: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `data:image/png;base64,${base64String}`;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    useEffect(() => {
        // Load front image from base64
        parseBase64ToPNG(back)
            .then((img) => {
                setFrontImage(img);
            })
            .catch((error) => {
                console.error("Error loading front image:", error);
            });

        // Load back image from base64
        parseBase64ToPNG(front)
            .then((img) => {
                setBackImage(img);
            })
            .catch((error) => {
                console.error("Error loading back image:", error);
            });
    }, [front, back]); // Add dependencies

    useEffect(() => {
        // white
        // color: {
        //     dark: '#ffffff',
        //     light: '#00000000',
        // },

        // black
        // color: {
        //     dark: '#000000',  // Set the dark part of the QR code to black
        //     light: '#00000000',  // Transparent background
        // },

        QRCode.toDataURL(qrCodeData, {
            width: 100,
            margin: 2,
            color: {
                dark: color === '#FFFFFF' ? '#ffffff' : '#000000',
                light: '#00000000',  // Transparent background
            },
        })
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error(err));
    }, [qrCodeData, `${color}`]);

    useEffect(() => {
        if (frontImage && backImage) {
            drawCard();
        }
    }, [frontImage, backImage, qrCodeUrl, name, title, backLogoUrl, fontSizeName, fontSizeTitle, backLogoSize, '#ffffff']);

    const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
    };

    const convertToGrayscale = (image: HTMLImageElement) => {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;

        if (ctx) {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const grayscale = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                data[i] = grayscale;
                data[i + 1] = grayscale;
                data[i + 2] = grayscale;
            }

            ctx.putImageData(imageData, 0, 0);
        }

        return tempCanvas;
    };

    const drawCard = () => {
        if (!frontImage || !backImage) return;

        const frontCanvas = frontCanvasRef.current;
        const frontCtx = frontCanvas?.getContext('2d');

        if (frontCanvas && frontCtx) {
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
            drawRoundedRect(frontCtx, 0, 0, frontCanvas.width, frontCanvas.height, 20);
            frontCtx.drawImage(frontImage, 0, 0, frontCanvas.width, frontCanvas.height);

            if (qrCodeUrl) {
                const qrImage = new Image();
                qrImage.src = qrCodeUrl;
                qrImage.onload = () => {
                    const qrSize = 170; // Increased size for better visibility
                    const centerX = (frontCanvas.width - qrSize) / 2;
                    const centerY = (frontCanvas.height - qrSize) / 2 - 30;
                    frontCtx.drawImage(qrImage, centerX, centerY, qrSize, qrSize);
                };
            }
            console.log(color);

            frontCtx.fillStyle = color;
            frontCtx.font = `bold ${fontSizeName}px Arial`;
            frontCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            frontCtx.shadowOffsetX = 2;
            frontCtx.shadowOffsetY = 2;
            frontCtx.shadowBlur = 10;
            frontCtx.fillText(name, 40, frontCanvas.height - 85);
            frontCtx.font = `italic ${fontSizeTitle}px Arial`;
            frontCtx.fillText(title, 40, frontCanvas.height - 50);
            frontCtx.shadowColor = 'transparent';
        }

        const backCanvas = backCanvasRef.current;
        const backCtx = backCanvas?.getContext('2d');

        if (backCanvas && backCtx) {
            backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
            drawRoundedRect(backCtx, 0, 0, backCanvas.width, backCanvas.height, 20);
            backCtx.drawImage(backImage, 0, 0, backCanvas.width, backCanvas.height);

            if (backLogoUrl) {
                const logoImage = new Image();
                logoImage.src = backLogoUrl;
                logoImage.onload = () => {
                    const grayscaleLogo = convertToGrayscale(logoImage);
                    backCtx.drawImage(grayscaleLogo, (backCanvas.width - backLogoSize) / 2, (backCanvas.height - backLogoSize) / 2, backLogoSize, backLogoSize);
                };
            } else {
                backCtx.fillStyle = 'rgba(128, 128, 128, 0.7)';
                backCtx.fillRect((backCanvas.width - backLogoSize) / 2, (backCanvas.height - backLogoSize) / 2, backLogoSize, backLogoSize);
                backCtx.fillStyle = '#FFFFFF';
                backCtx.font = 'bold 22px Arial';
                backCtx.textAlign = 'center';
                backCtx.fillText('Качете вашето лого', backCanvas.width / 2, backCanvas.height / 2);
            }
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, setLogoFn: React.Dispatch<React.SetStateAction<string | null>>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setLogoFn(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSaveDesign = () => {
        setShowModal(true); // Show the modal when the user clicks save
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const frontCanvas = frontCanvasRef.current;
        const backCanvas = backCanvasRef.current;

        let frontDataUrl = '';
        let backDataUrl = '';
        if (frontCanvas && backCanvas) {
            // Resize and compress the front canvas
            frontDataUrl = resizeAndCompressCanvas(frontCanvas, 200, 200, 0.2); // Resize to 300x200 and set quality to 0.8

            // Resize and compress the back canvas
            backDataUrl = resizeAndCompressCanvas(backCanvas, 200, 200, 0.2); // Resize to 300x200 and set quality to 0.8
        }

        let data = {
            cardName: name,
            cardTitle: title,
            userName,
            userPhone,
            userEmail,
            frontDataUrl,
            backDataUrl,
            backLogoUrl,
            courierIsSpeedy,  // Pass the courier selection
            courierAddress,

        };
        console.log(data);


        // Make API call to save the data
        try {
            const response = await fetch(`${BASE_API_URL}/api/saveCardDesign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Неуспешно запазване на дизайна');
            }

            const result = await response.json();
            setAlert({
                message: 'Дизайнът беше успешно запазен!',
                title: 'Успех',
                color: 'green',
            });
        } catch (error) {
            console.error('Грешка при запазването на дизайна:', error);
            setAlert({
                message: 'Неуспешно запазване на дизайна. Моля, опитайте отново.',
                title: 'Грешка',
                color: 'red',
            });
        } finally {
            setLoading(false);  // Спиране на зареждането
        }

        setShowModal(false); // Hide modal after submission
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    const resizeAndCompressCanvas = (
        canvas: HTMLCanvasElement,
        newWidth: number,
        newHeight: number,
        quality: number
    ): string => {
        const resizedCanvas = document.createElement('canvas');
        const ctx = resizedCanvas.getContext('2d');

        // Set the new dimensions
        resizedCanvas.width = newWidth;
        resizedCanvas.height = newHeight;

        if (ctx) {
            // Draw the current canvas to the new, smaller canvas
            ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
        }

        // Compress and return the new data URL, using a quality factor
        return resizedCanvas.toDataURL('image/jpeg', quality);
    };
    const increaseFontSizeName = () => setFontSizeName((prev) => Math.min(prev + 2, 40));
    const decreaseFontSizeName = () => setFontSizeName((prev) => Math.max(prev - 2, 20));

    const increaseFontSizeTitle = () => setFontSizeTitle((prev) => Math.min(prev + 2, 32));
    const decreaseFontSizeTitle = () => setFontSizeTitle((prev) => Math.max(prev - 2, 16));

    const increaseBackLogoSize = () => setBackLogoSize((prev) => Math.min(prev + 10, 280));
    const decreaseBackLogoSize = () => setBackLogoSize((prev) => Math.max(prev - 10, 50));

    return (
        <div className="designer-container text-white flex flex-col items-center p-10 rounded-lg  bg-gray-800">
            {alert && (
                <div
                    className={`p-10 rounded-lg mb-6 text-white transition-all duration-500 ease-in-out transform ${alert.color === 'green'
                        ? 'bg-green-500 border border-green-700 shadow-lg'
                        : 'bg-red-500 border border-red-700 shadow-lg'
                        } animate-fadeIn flex items-center space-x-4`}
                >
                    {/* Alert Icon */}
                    <div>
                        {alert.color === 'green' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414 0L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-4a1 1 0 10-2 0v4a1 1 0 002 0V6zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    {/* Alert Message */}
                    <div>
                        <strong className="text-lg font-bold">{alert.title}:</strong> <span className="text-md">{alert.message}</span>
                    </div>
                </div>
            )}


            {loading ? (
                <div className="flex justify-center items-center py-72">
                    <img src="/load.gif" alt="Зареждане..." className="w-40 h-40" />
                </div>
            ) : (
                <>
                    <h1 className="text-4xl font-bold mb-8">Дизайн на NFC Карта</h1>
                    <div className="card-preview grid gap-8">
                        <div className="row">
                            <h3 className="text-center text-lg font-bold mb-2">Предна част на картата</h3>
                            <canvas ref={frontCanvasRef} width={602} height={368} className="rounded-lg shadow-lg w-full"></canvas>
                        </div>
                        <div className="row">
                            <h3 className="text-center text-lg font-bold mb-2">Задна част на картата</h3>
                            <canvas ref={backCanvasRef} width={610} height={368} className="rounded-lg shadow-lg w-full"></canvas>
                        </div>
                    </div>
                    <div className="controls mt-8 w-full max-w-lg space-y-6">
                        <label className="block text-sm font-medium">
                            Име:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </label>
                        <label className="block text-sm font-medium">
                            Позиция:
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </label>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Размер на шрифт за име:</label>
                            <div className="flex space-x-2">
                                <button onClick={decreaseFontSizeName} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                                <span>{fontSizeName}</span>
                                <button onClick={increaseFontSizeName} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Размер на шрифт за позиция Ви:</label>
                            <div className="flex space-x-2">
                                <button onClick={decreaseFontSizeTitle} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                                <span>{fontSizeTitle}</span>
                                <button onClick={increaseFontSizeTitle} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                            </div>
                        </div>
                        <label className="block text-sm font-medium">
                            Данни за QR код:
                            <input type="text" value={qrCodeData} onChange={(e) => setQrCodeData(e.target.value)} className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </label>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Промяна на размер на лого отзад:</label>
                            <div className="flex space-x-2">
                                <button onClick={decreaseBackLogoSize} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                                <span>{backLogoSize}</span>
                                <button onClick={increaseBackLogoSize} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                            </div>
                        </div>
                        <label className="block text-sm font-medium">
                            Качете лого/изображение отзад:
                            <input type="file" onChange={(e) => handleLogoUpload(e, setBackLogoUrl)} className="mt-2 w-full p-2 border border-gray-400 rounded-lg bg-gray-700 text-white cursor-pointer" />
                        </label>
                    </div>
                    <button onClick={handleSaveDesign} className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full max-w-xs">
                        Запазване на дизайна
                    </button>
                </>
            )}




            {showModal && (
                <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-black p-10 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Изпрати Дизайн</h2>
                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            {/* User Name */}
                            <div>
                                <label className="block text-sm font-medium">Име:</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                    className="mt-2 p-2 w-full border text-black rounded"
                                />
                            </div>

                            {/* User Email */}
                            <div>
                                <label className="block text-sm font-medium">Имейл:</label>
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    required
                                    className="mt-2 p-2 w-full border text-black rounded"
                                />
                            </div>

                            {/* User Phone */}
                            <div>
                                <label className="block text-sm font-medium">Телефон:</label>
                                <input
                                    type="tel"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    required
                                    className="mt-2 p-2 w-full border text-black rounded"
                                />
                            </div>

                            {/* Courier Type (courierIsSpeedy) */}
                            <div>
                                <label className="block text-sm font-medium">Избери Куриера:</label>
                                <select
                                    value={courierIsSpeedy}
                                    onChange={(e) => setCourierIsSpeedy(Number(e.target.value))}
                                    required
                                    className="mt-2 p-2 w-full border text-black rounded"
                                >
                                    <option value={1}>Спиди</option>
                                    <option value={0}>Еконт</option>
                                </select>
                            </div>

                            {/* Courier Address (courierAddress) */}
                            <div>
                                <label className="block text-sm font-medium">Адрес на куриера:</label>
                                <input
                                    type="text"
                                    value={courierAddress}
                                    onChange={(e) => setCourierAddress(e.target.value)}
                                    required
                                    className="mt-2 p-2 w-full border text-black rounded"
                                />
                            </div>

                            {/* Form Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Отказ
                                </button>
                                <button
                                    onClick={handleSaveDesign}
                                    type="submit"
                                    className="bg-orange text-white py-2 px-4 rounded"
                                >
                                    Запазване
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomCardDesigner;
