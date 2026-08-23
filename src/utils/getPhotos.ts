import fs from "fs";
import path from "path";

export interface PhotoData {
  src: string;
  alt: string;
  category: string;
  span: string;
}

export function getPhotos(): PhotoData[] {
  const baseDir = path.join(process.cwd(), "public", "photos");
  const metaPath = path.join(baseDir, "meta.json");
  
  let metadata: Record<string, string> = {};
  if (fs.existsSync(metaPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    } catch (e) {
      console.error("Error reading photos metadata", e);
    }
  }

  const photos: PhotoData[] = [];
  
  if (!fs.existsSync(baseDir)) return [];

  const files = fs.readdirSync(baseDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  
  const spans = ["normal", "wide", "normal", "tall", "wide", "tall", "normal"];
  let spanIdx = 0;

  for (const file of files) {
    // Read the description from metadata.json, fallback to a generic description
    const altText = metadata[file] || "A captured moment";
    
    const base = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";
    photos.push({
      src: `${base}/photos/${file}`,
      alt: altText,
      category: "Life", // Generic category for backwards compatibility with the interface
      span: spans[spanIdx % spans.length]
    });
    spanIdx++;
  }

  return photos;
}

export function getCategories(photos: PhotoData[]): string[] {
  return ["All"];
}
