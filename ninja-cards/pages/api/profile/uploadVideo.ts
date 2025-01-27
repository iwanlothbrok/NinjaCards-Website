import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import formidable, { IncomingForm } from "formidable";
import fs from "fs/promises";
import cors from "@/utils/cors";

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const form = new IncomingForm({
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // Allow files up to 20MB
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

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Методът не е разрешен" });
    }

    try {
        const { fields, files } = await parseForm(req);

        const userId = Array.isArray(fields.id) ? fields.id[0] : fields.id; // Ensure `userId` is a string
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "ID на потребителя е задължително" });
        }

        const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
        if (!videoFile) {
            return res.status(400).json({ error: "Няма избран видео файл" });
        }

        const videoBuffer = await fs.readFile(videoFile.filepath);

        // Use upsert to add or update the video for the user
        const video = await prisma.video.upsert({
            where: { userId }, // Check if a video exists for this user
            update: {
                data: videoBuffer, // Update the video data
            },
            create: {
                userId,
                data: videoBuffer, // Create a new video entry
            },
        });

        res.status(200).json({ success: true, videoId: video.id });
    } catch (error) {
        console.error("Error uploading video:", error);
        res.status(500).json({ error: "Вътрешна грешка при качването на видеото" });
    }
}
