import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function generatePDF({
    id,
    qrPath,
}: {
    id: string;
    qrPath: string;
}): Promise<string> {
    const templatePath = path.join(process.cwd(), 'public', 'pb2.pdf');
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(new Uint8Array(existingPdfBytes));

    const pages = pdfDoc.getPages();
    const page = pages[0];

    const qrImageBytes = fs.readFileSync(qrPath);
    const qrImage = await pdfDoc.embedPng(new Uint8Array(qrImageBytes));

    const { width, height } = page.getSize();

    // 🎯 Нови точно измерени стойности на синята зона:
    const blueBoxX = 163;
    const blueBoxY = 310;
    const blueBoxWidth = 300;
    const blueBoxHeight = 160;

    // 📏 По-малък QR код
    const qrDims = qrImage.scale(0.20);

    // ✅ Центриране на QR в синята зона
    const qrX = blueBoxX + (blueBoxWidth - qrDims.width) / 2;
    const qrY = blueBoxY + (blueBoxHeight - qrDims.height) / 2 + 5; // +5 за лека корекция нагоре

    page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrDims.width,
        height: qrDims.height,
    });

    // ✅ ID текст – по-нагоре, по-ясен и удебелен
    const font = await pdfDoc.embedFont('Helvetica-Bold');
    page.drawText(`${id}`, {
        x: blueBoxX + 40,
        y: blueBoxY + 22,
        size: 13,
        font,
        color: rgb(1, 1, 1), // бяло
    });

    const pdfBytes = await pdfDoc.save();
    const outputDir = path.join(process.cwd(), 'public', 'pdfs');
    fs.mkdirSync(outputDir, { recursive: true });

    const filePath = path.join(outputDir, `${id}.pdf`);
    fs.writeFileSync(filePath, pdfBytes);

    return filePath;
}
