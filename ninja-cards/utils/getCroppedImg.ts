// utils/getCroppedImg.ts
export default async function getCroppedImg(imageSrc: string, crop: { x: number; y: number; width: number; height: number }): Promise<File> {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) throw new Error("Failed to get canvas context");

            const scaleX = image.width / image.naturalWidth;
            const scaleY = image.height / image.naturalHeight;

            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
                    resolve(file);
                }
            });
        };
    });
}
