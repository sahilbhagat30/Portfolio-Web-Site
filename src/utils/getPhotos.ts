import fs from "fs";
import path from "path";

export interface PhotoData {
  src: string;
  alt: string;
  category: string;
  span: string;
}

export function getPhotos(): PhotoData[] {
  const baseDir = path.join(process.cwd(), "public", "photos", "personal");
  const photos: PhotoData[] = [];
  
  if (!fs.existsSync(baseDir)) return [];

  const categories = fs.readdirSync(baseDir).filter((f) => {
    try {
      return fs.statSync(path.join(baseDir, f)).isDirectory();
    } catch {
      return false;
    }
  });

  const spans = ["normal", "wide", "normal", "tall", "wide", "tall", "normal"];
  let spanIdx = 0;

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);
    const files = fs.readdirSync(categoryPath).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    
    for (const file of files) {
      // Create a readable alt text from the filename
      const altText = file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      
      const base = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";
      photos.push({
        src: `${base}/photos/personal/${category}/${file}`,
        alt: altText,
        category: category,
        span: spans[spanIdx % spans.length]
      });
      spanIdx++;
    }
  }

  return photos;
}

export function getCategories(photos: PhotoData[]): string[] {
  const cats = new Set(photos.map(p => p.category));
  return ["All", ...Array.from(cats)];
}
