import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

/**
 * Генерира PNG QR код за даден URL и го записва във файл.
 * @param url URL, който да се кодира
 * @param id Име на файла (уникално ID)
 * @returns Път до PNG файла
 */
export async function generateQRCode(url: string, name: string, id: string): Promise<string> {
    const outputDir = path.join(process.cwd(), 'public', 'qrcodes');
    fs.mkdirSync(outputDir, { recursive: true });

    const filePath = path.join(outputDir, `${name}-${id}.png`);
    await QRCode.toFile(filePath, url, {
        type: 'png',
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
            dark: '#ffffff', // vibrant purple
            light: '#00000000' // transparent background
        }
    });

    return filePath;
}
