import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { BASE_API_URL } from '@/utils/constants';

const CustomCardDesigner = () => {
    const [qrCodeData, setQrCodeData] = useState<string>('https://example.com');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [name, setName] = useState<string>('Вашето име');
    const [title, setTitle] = useState<string>('Вашата позиция');
    const [backLogoUrl, setBackLogoUrl] = useState<string | null>(null);
    const [fontSizeName, setFontSizeName] = useState<number>(32);
    const [fontSizeTitle, setFontSizeTitle] = useState<number>(24);
    const [backLogoSize, setBackLogoSize] = useState<number>(240);
    const frontCanvasRef = useRef<HTMLCanvasElement>(null);
    const backCanvasRef = useRef<HTMLCanvasElement>(null);
    const [frontImage, setFrontImage] = useState<HTMLImageElement | null>(null);
    const [backImage, setBackImage] = useState<HTMLImageElement | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');

    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        img1.src = '/back2.png'; // You can replace this with your front card image URL
        img2.src = '/back.png'; // You can replace this with your back card image URL
        img1.onload = () => setFrontImage(img1);
        img2.onload = () => setBackImage(img2);
    }, []);

    useEffect(() => {
        QRCode.toDataURL(qrCodeData, {
            width: 100,
            margin: 2,
            color: {
                dark: '#ffffff',
                light: '#00000000',
            },
        })
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error(err));
    }, [qrCodeData, '#ffffff']);

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
                    const qrSize = 180; // Increased size for better visibility
                    const centerX = (frontCanvas.width - qrSize) / 2;
                    const centerY = (frontCanvas.height - qrSize) / 2 - 20;
                    frontCtx.drawImage(qrImage, centerX, centerY, qrSize, qrSize);
                };
            }

            frontCtx.fillStyle = '#ffffff';
            frontCtx.font = `bold ${fontSizeName}px Arial`;
            frontCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
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
                backCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                backCtx.fillRect((backCanvas.width - backLogoSize) / 2, (backCanvas.height - backLogoSize) / 2, backLogoSize, backLogoSize);
                backCtx.fillStyle = '#ffffff';
                backCtx.font = 'bold 16px Arial';
                backCtx.textAlign = 'center';
                backCtx.fillText('Качете лого/изображение', backCanvas.width / 2, backCanvas.height / 2);
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
            frontDataUrl = frontCanvas.toDataURL('image/png');
            backDataUrl = backCanvas.toDataURL('image/png');
        }

        let data = {
            cardName: name,
            cardTitle: title,
            userName,
            userPhone,
            userEmail,
            frontDataUrl,
            backDataUrl
        };

        // Make API call to save the data
        try {
            const response = await fetch(`${BASE_API_URL}/api/saveCardDesign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Card design saved:', result);
                // Optionally, show a success message to the user
            } else {
                console.error('Failed to save card design');
            }
        } catch (error) {
            console.error('Error saving card design:', error);
        }

        setShowModal(false); // Hide modal after submission
    };

    const increaseFontSizeName = () => setFontSizeName((prev) => Math.min(prev + 2, 40));
    const decreaseFontSizeName = () => setFontSizeName((prev) => Math.max(prev - 2, 20));

    const increaseFontSizeTitle = () => setFontSizeTitle((prev) => Math.min(prev + 2, 32));
    const decreaseFontSizeTitle = () => setFontSizeTitle((prev) => Math.max(prev - 2, 16));

    const increaseBackLogoSize = () => setBackLogoSize((prev) => Math.min(prev + 10, 280));
    const decreaseBackLogoSize = () => setBackLogoSize((prev) => Math.max(prev - 10, 50));

    return (
        <div className="designer-container text-white flex flex-col items-center p-10 rounded-lg  bg-gray-800">
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

            {showModal && (
                <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-black p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Изпрати Дизайн</h2>
                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Име:</label>
                                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required className="mt-2 p-2 w-full border text-black rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Имейл:</label>
                                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required className="mt-2 p-2 w-full border text-black rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Телефон:</label>
                                <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required className="mt-2 p-2 w-full border text-black rounded" />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white py-2 px-4 rounded">Отказ</button>
                                <button onClick={handleSaveDesign} type="submit" className="bg-orange text-white py-2 px-4 rounded">Запазване</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCardDesigner;
