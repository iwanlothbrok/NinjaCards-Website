import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
    const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'PUT') {
        try {
            const { fields, files } = await parseForm(req);

            const id = fields.id ? fields.id[0] : undefined;
            if (!id) {
                res.status(400).json({ error: 'ID е задължително поле' });
                return;
            }

            // Check if an image file is provided
            if (!files.image) {
                res.status(400).json({ error: 'Файл с изображение е задължителен' });
                return;
            }

            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

            // Validate image file size
            if (imageFile.size > 2500 * 1024) {
                res.status(400).json({ error: 'Размерът на изображението надвишава лимита от 2500 KB' });
                return;
            }

            // Read image file and convert to base64
            const imageData = fs.readFileSync(imageFile.filepath);
            const base64Image = imageData.toString('base64');

            // Update the user's profile image in the database
            await prisma.user.update({
                where: { id: id },
                data: { image: base64Image },
            });

            const updatedUser = await prisma.user.findUnique({
                where: { id: id },
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error('Грешка при актуализиране на профилната снимка:', error);
            res.status(500).json({ error: 'Неуспешно актуализиране на профилната снимка', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Методът не е разрешен' });
    }
}
