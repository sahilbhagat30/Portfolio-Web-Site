import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'sequence');

async function processFiles() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} PNG files. Starting conversion to WebP...`);
  
  let totalSaved = 0;
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.png', '.webp'));
    
    const info = await sharp(inputPath)
      .webp({ quality: 75 }) // Good balance of quality and size
      .toFile(outputPath);
      
    const originalSize = fs.statSync(inputPath).size;
    const newSize = info.size;
    totalSaved += (originalSize - newSize);
    
    // Delete original PNG
    fs.unlinkSync(inputPath);
    console.log(`Converted ${file} -> saved ${(originalSize - newSize) / 1024 | 0} KB`);
  }
  
  console.log(`\nAll done! Total space saved: ${totalSaved / 1024 / 1024 | 0} MB`);
}

processFiles().catch(console.error);
