import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logosDir = path.join(process.cwd(), "public", "logos");
    const files = fs.readdirSync(logosDir);
    
    const logos = files
      .filter(file => !file.startsWith(".") && !file.endsWith(".DS_Store"))
      .map(file => {
        const filePath = path.join(logosDir, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        const isVideo = [".mp4", ".webm", ".mov", ".avi", ".mkv"].includes(ext);
        const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"].includes(ext);
        
        return {
          name: file,
          url: `/logos/${encodeURIComponent(file)}`,
          type: isVideo ? "video" : isImage ? "image" : "image",
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
    
    return NextResponse.json(logos);
  } catch (error) {
    console.error("Error reading logos directory:", error);
    return NextResponse.json({ error: "Failed to read logos" }, { status: 500 });
  }
}