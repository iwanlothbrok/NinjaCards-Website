import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const CustomCardDesigner = () => {
    const [qrCodeData, setQrCodeData] = useState<string>('https://example.com');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [name, setName] = useState<string>('Вашето име');
    const [title, setTitle] = useState<string>('Вашата титла');
    const [frontLogoUrl, setFrontLogoUrl] = useState<string | null>(null);
    const [backLogoUrl, setBackLogoUrl] = useState<string | null>(null);
    const [fontSizeName, setFontSizeName] = useState<number>(26);
    const [fontSizeTitle, setFontSizeTitle] = useState<number>(18);
    const [frontLogoSize, setFrontLogoSize] = useState<number>(120);
    const [backLogoSize, setBackLogoSize] = useState<number>(220);
    const frontCanvasRef = useRef<HTMLCanvasElement>(null);
    const backCanvasRef = useRef<HTMLCanvasElement>(null);
    const [frontImage, setFrontImage] = useState<HTMLImageElement | null>(null);
    const [backImage, setBackImage] = useState<HTMLImageElement | null>(null);
    const [qrColor, setQrColor] = useState<string>('#ffffff');
    const [textColor, setTextColor] = useState<string>('#ffffff');
    const [nfcColor, setNfcColor] = useState<string>('#ffffff');

    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        img1.src = '/back2.png';
        img2.src = '/back.png';
        img1.onload = () => setFrontImage(img1);
        img2.onload = () => setBackImage(img2);
    }, []);

    useEffect(() => {
        QRCode.toDataURL(qrCodeData, {
            width: 100,
            margin: 0,
            color: {
                dark: qrColor,
                light: '#00000000',
            },
        })
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error(err));
    }, [qrCodeData, qrColor]);

    useEffect(() => {
        if (frontImage && backImage) {
            drawCard();
        }
    }, [frontImage, backImage, qrCodeUrl, name, title, frontLogoUrl, backLogoUrl, fontSizeName, fontSizeTitle, frontLogoSize, backLogoSize, textColor, nfcColor]);

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

            if (!frontLogoUrl) {
                frontCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                frontCtx.lineWidth = 2;
                frontCtx.strokeRect(frontCanvas.width - frontLogoSize - 15, 15, frontLogoSize, frontLogoSize);
            }

            if (qrCodeUrl) {
                const qrImage = new Image();
                qrImage.src = qrCodeUrl;
                qrImage.onload = () => {
                    frontCtx.drawImage(qrImage, 25, frontCanvas.height - 300, 110, 110);
                };
            }

            if (frontLogoUrl) {
                const logoImage = new Image();
                logoImage.src = frontLogoUrl;
                logoImage.onload = () => {
                    const grayscaleLogo = convertToGrayscale(logoImage);
                    frontCtx.drawImage(grayscaleLogo, frontCanvas.width - frontLogoSize - 15, 15, frontLogoSize, frontLogoSize);
                };
            }

            frontCtx.fillStyle = textColor;
            frontCtx.font = `bold ${fontSizeName}px Arial`;
            frontCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            frontCtx.shadowOffsetX = 2;
            frontCtx.shadowOffsetY = 2;
            frontCtx.shadowBlur = 10;
            frontCtx.fillText(name, 20, frontCanvas.height - 55);
            frontCtx.font = `italic ${fontSizeTitle}px Arial`;
            frontCtx.fillText(title, 20, frontCanvas.height - 30);
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
                backCtx.font = 'bold 12px Arial';
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
        const frontCanvas = frontCanvasRef.current;
        const backCanvas = backCanvasRef.current;

        if (frontCanvas && backCanvas) {
            const frontDataUrl = frontCanvas.toDataURL('image/png');
            const backDataUrl = backCanvas.toDataURL('image/png');

            console.log('Запазено преден дизайн:', frontDataUrl);
            console.log('Запазено заден дизайн:', backDataUrl);
        }
    };

    const increaseFontSizeName = () => setFontSizeName((prev) => Math.min(prev + 2, 40));
    const decreaseFontSizeName = () => setFontSizeName((prev) => Math.max(prev - 2, 10));

    const increaseFontSizeTitle = () => setFontSizeTitle((prev) => Math.min(prev + 2, 30));
    const decreaseFontSizeTitle = () => setFontSizeTitle((prev) => Math.max(prev - 2, 10));

    const increaseFrontLogoSize = () => setFrontLogoSize((prev) => Math.min(prev + 10, 200));
    const decreaseFrontLogoSize = () => setFrontLogoSize((prev) => Math.max(prev - 10, 50));

    const increaseBackLogoSize = () => setBackLogoSize((prev) => Math.min(prev + 10, 250));
    const decreaseBackLogoSize = () => setBackLogoSize((prev) => Math.max(prev - 10, 50));

    return (
        <div className="designer-container text-white flex flex-col items-center bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Дизайн на NFC Карта</h1>
            <div className="card-preview flex flex-col lg:flex-row gap-8">
                <div className='row'>
                    <h3 className="text-center text-lg font-bold mb-2">Предна част на картата</h3>
                    <canvas ref={frontCanvasRef} width={502} height={318} className="rounded-lg shadow-lg border border-gray-400 w-full max-w-xs lg:max-w-none"></canvas>
                </div>
            </div>
            <div className="controls mt-6 w-full max-w-lg">
                <label className="block text-sm font-medium mt-4 mb-1">
                    Име:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
                <div className="flex items-center justify-between mt-2">
                    <label className="text-sm font-medium">Размер на шрифт за име:</label>
                    <div className="flex space-x-2">
                        <button onClick={decreaseFontSizeName} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                        <span>{fontSizeName}</span>
                        <button onClick={increaseFontSizeName} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <label className="text-sm font-medium">Размер на шрифт за титла:</label>
                    <div className="flex space-x-2">
                        <button onClick={decreaseFontSizeTitle} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                        <span>{fontSizeTitle}</span>
                        <button onClick={increaseFontSizeTitle} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                    </div>
                </div>
                <label className="block text-sm font-medium mt-4 mb-1">
                    Данни за QR код:
                    <input type="text" value={qrCodeData} onChange={(e) => setQrCodeData(e.target.value)} className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
                <div className="flex items-center justify-between mt-2">
                    <label className="text-sm font-medium">Промяна на размер на лого отпред:</label>
                    <div className="flex space-x-2">
                        <button onClick={decreaseFrontLogoSize} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                        <span>{frontLogoSize}</span>
                        <button onClick={increaseFrontLogoSize} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                    </div>
                </div>
            </div>

            <div className="card-preview flex flex-col lg:flex-row gap-8">
                <div className='row'>
                    <h3 className="text-center text-lg font-bold mb-2">Задна част на картата</h3>
                    <canvas ref={backCanvasRef} width={510} height={318} className="rounded-lg shadow-lg border border-gray-400 w-full max-w-xs lg:max-w-none"></canvas>
                </div>
            </div>
            <div className="controls mt-6 w-full max-w-lg">
                <div className="flex items-center justify-between mt-2">
                    <label className="text-sm font-medium">Промяна на размер на лого отзад:</label>
                    <div className="flex space-x-2">
                        <button onClick={decreaseBackLogoSize} className="px-2 py-1 bg-gray-600 text-white rounded">-</button>
                        <span>{backLogoSize}</span>
                        <button onClick={increaseBackLogoSize} className="px-2 py-1 bg-gray-600 text-white rounded">+</button>
                    </div>
                </div>
                <label className="block text-sm font-medium mt-4 mb-1">
                    Качете лого/изображение отзад:
                    <input type="file" onChange={(e) => handleLogoUpload(e, setBackLogoUrl)} className="mt-2 w-full p-2 border border-gray-400 rounded-lg bg-gray-700 text-white cursor-pointer" />
                </label>
            </div>

            <button onClick={handleSaveDesign} className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full max-w-xs">
                Запазване на дизайна
            </button>
        </div>
    );
};

export default CustomCardDesigner;
