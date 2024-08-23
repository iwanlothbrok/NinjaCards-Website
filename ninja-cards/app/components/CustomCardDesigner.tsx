import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const CustomCardDesigner = () => {
    const [qrCodeData, setQrCodeData] = useState<string>('https://example.com');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [name, setName] = useState<string>('Your Name');
    const [title, setTitle] = useState<string>('Title');
    const [frontLogoUrl, setFrontLogoUrl] = useState<string | null>(null);
    const [backLogoUrl, setBackLogoUrl] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<number>(20); // Increased font size for better readability
    const frontCanvasRef = useRef<HTMLCanvasElement>(null);
    const backCanvasRef = useRef<HTMLCanvasElement>(null);
    const [frontImage, setFrontImage] = useState<HTMLImageElement | null>(null);
    const [backImage, setBackImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        img1.src = '/front01.png'; // Load the front background image from the public folder
        img2.src = '/front01.png'; // Load the back background image from the public folder
        img1.onload = () => setFrontImage(img1);
        img2.onload = () => setBackImage(img2);
    }, []);

    useEffect(() => {
        QRCode.toDataURL(qrCodeData, {
            width: 100,
            margin: 0,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        })
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error(err));
    }, [qrCodeData]);

    useEffect(() => {
        if (frontImage && backImage) {
            drawCard();
        }
    }, [frontImage, backImage, qrCodeUrl, name, title, frontLogoUrl, backLogoUrl, fontSize]);

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

    const drawCard = () => {
        if (!frontImage || !backImage) return;

        // Drawing Front of the Card
        const frontCanvas = frontCanvasRef.current;
        const frontCtx = frontCanvas?.getContext('2d');

        if (frontCanvas && frontCtx) {
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
            drawRoundedRect(frontCtx, 0, 0, frontCanvas.width, frontCanvas.height, 20); // Rounded corners with a radius of 20
            frontCtx.drawImage(frontImage, 0, 0, frontCanvas.width, frontCanvas.height);

            // QR Code
            if (qrCodeUrl) {
                const qrImage = new Image();
                qrImage.src = qrCodeUrl;
                qrImage.onload = () => {
                    frontCtx.drawImage(qrImage, 20, 20, 70, 70);
                };
            }

            // Front Logo
            if (frontLogoUrl) {
                const logoImage = new Image();
                logoImage.src = frontLogoUrl;
                logoImage.onload = () => {
                    frontCtx.drawImage(logoImage, frontCanvas.width - 120, 20, 100, 100);
                };
            }

            // Name and Title
            frontCtx.fillStyle = '#ffffff';
            frontCtx.font = `bold ${fontSize}px Arial`; // Bolder font
            frontCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            frontCtx.shadowOffsetX = 2;
            frontCtx.shadowOffsetY = 2;
            frontCtx.shadowBlur = 5;
            frontCtx.fillText(name, 20, frontCanvas.height - 60);
            frontCtx.font = `italic ${fontSize * 0.8}px Arial`; // Italic title
            frontCtx.fillText(title, 20, frontCanvas.height - 30);
            frontCtx.shadowColor = 'transparent'; // Reset shadow
        }

        // Drawing Back of the Card
        const backCanvas = backCanvasRef.current;
        const backCtx = backCanvas?.getContext('2d');

        if (backCanvas && backCtx) {
            backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
            drawRoundedRect(backCtx, 0, 0, backCanvas.width, backCanvas.height, 20); // Rounded corners with a radius of 20
            backCtx.drawImage(backImage, 0, 0, backCanvas.width, backCanvas.height);

            // Back Logo/Image
            if (backLogoUrl) {
                const logoImage = new Image();
                logoImage.src = backLogoUrl;
                logoImage.onload = () => {
                    backCtx.drawImage(logoImage, 20, 20, backCanvas.width - 40, backCanvas.height - 40);
                };
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

            // Here you would send these dataUrls to the server to save the images
            console.log('Front Design saved:', frontDataUrl);
            console.log('Back Design saved:', backDataUrl);
        }
    };

    return (
        <div className="designer-container flex flex-col items-center">
            <div className="card-preview  grid grid-cols-1 ">
                <div>
                    <h3 className="text-center text-lg font-bold mb-2">Front of the Card</h3>
                    <canvas ref={frontCanvasRef} width={340} height={217} className="border rounded-lg shadow-lg"></canvas>
                </div>
                <div>
                    <h3 className="text-center text-lg font-bold mb-2">Back of the Card</h3>
                    <canvas ref={backCanvasRef} width={340} height={217} className="border rounded-lg shadow-lg"></canvas>
                </div>
            </div>
            <div className="controls mt-6 w-full max-w-xl">
                <label className="block">
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
                </label>
                <label className="block mt-4">
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
                </label>
                <label className="block mt-4">
                    Font Size:
                    <input type="range" min="10" max="30" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="mt-2 w-full" />
                </label>
                <label className="block mt-4">
                    QR Code Data:
                    <input type="text" value={qrCodeData} onChange={(e) => setQrCodeData(e.target.value)} className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
                </label>
                <label className="block mt-4">
                    Upload Front Logo:
                    <input type="file" onChange={(e) => handleLogoUpload(e, setFrontLogoUrl)} className="mt-2 w-full" />
                </label>
                <label className="block mt-4">
                    Upload Back Logo/Image:
                    <input type="file" onChange={(e) => handleLogoUpload(e, setBackLogoUrl)} className="mt-2 w-full" />
                </label>
                <button onClick={handleSaveDesign} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full">
                    Save Design
                </button>
            </div>
        </div>
    );
};

export default CustomCardDesigner;
