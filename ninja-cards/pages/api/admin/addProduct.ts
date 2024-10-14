import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,  // We will handle form data manually
    },
};
const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
    const form = new IncomingForm({
        multiples: false,    // No need for multiple file uploads in this case
        keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

// Helper function to parse the incoming form data
const parseField = (field: string | string[] | undefined): string | undefined => {
    if (Array.isArray(field)) {
        return field[0]; // Extract the first element if it's an array
    }
    return field; // Return the value if it's a single string
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // Stop if this is a CORS preflight request

    if (req.method === 'POST') {
        try {
            const { fields, files } = await parseForm(req);

            // Safely extract fields and ensure they are strings
            const title = parseField(fields.title);
            const price = parseField(fields.price);
            const type = parseField(fields.type);
            const qrColor = parseField(fields.qrColor);
            const oldPrice = parseField(fields.oldPrice);

            // Check if all required fields are present
            if (!title || !price || !type || !qrColor) {
                return res.status(400).json({ error: 'Title, description, price, and type are required' });
            }

            // Restrict 'type' field to allowed values
            const allowedTypes = ['cards', 'reviews', 'stickers'];
            if (!allowedTypes.includes(type)) {
                return res.status(400).json({ error: `Type must be one of: ${allowedTypes.join(', ')}` });
            }

            // Handle images as in the previous example
            const processImage = (imageFile: formidable.File | undefined) => {
                if (!imageFile) return null;
                // if (imageFile.size > 700 * 1024) {
                //     throw new Error('Image size exceeds the 700 KB limit');
                // }
                const imageData = fs.readFileSync(imageFile.filepath);
                return imageData.toString('base64');
            };

            const image = processImage(Array.isArray(files.image) ? files.image[0] : files.image);
            const frontImage = processImage(Array.isArray(files.frontImage) ? files.frontImage[0] : files.frontImage);
            const backImage = processImage(Array.isArray(files.backImage) ? files.backImage[0] : files.backImage);

            // Create the product in the database
            const product = await prisma.product.create({
                data: {
                    title,
                    price: parseFloat(price),
                    type,
                    image: image ?? "",                // Fallback for image
                    frontImage,
                    backImage,
                    qrColor,
                    oldPrice: parseFloat(oldPrice || '0'),
                },
            });

            res.status(201).json(product);
        } catch (error: any) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Failed to create product', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
