// pages/api/products.js
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'POST') {
        const { title, description, price, imageUrl, nfcType, features, benefits } = req.body;
        if (
            !title || !description || !price || !imageUrl ||
            !features || !benefits) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        try {
            const product = await prisma.product.create({
                data: {
                    title,
                    description,
                    price,
                    imageUrl,
                    nfcType,
                    features: {
                        create: features.map((name: string) => ({ name })),
                    },
                    benefits: {
                        create: benefits.map((name: string) => ({ name })),
                    },
                },
            });

            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error creating product' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}


//         if (!name || !email || !subject || !phone) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         if (!validateEmail(email)) {
//             return res.status(400).json({ error: 'Invalid email address' });
//         }

//         // You can add more validation logic here
//         const contact = await prisma.contact.create({
//             data: {
//                 name,
//                 email,
//                 phone,
//                 subject
//             },
//         });
//         // Simulate email sending (you would normally send an email here)
//         return res.status(200).json(contact);
//     } else {
//         res.setHeader('Allow', ['POST']);
//         return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
