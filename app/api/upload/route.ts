import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// إعداد Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: { formData: () => any; }) {
    try {
        const data = await request.formData();
        const file = data.get("image");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // قراءة الملف كـ Buffer
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        // ارفع الصورة لـ Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(
            `data:${file.type};base64,${base64}`
        );

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
