const fs = require('fs');
const path = require('path');
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const dir = path.dirname(filePath);
      let target = path.resolve(dir, importPath);
      // Try to find the file
      const exts = ['.tsx', '.ts', '.js', '.jsx'];
      let found = false;
      for (const ext of exts) {
        if (fs.existsSync(target + ext)) {
          found = true;
          // check exact case
          const realName = fs.readdirSync(path.dirname(target + ext)).find(n => n === path.basename(target + ext));
          if (realName !== path.basename(target + ext)) {
            console.log("CASE MISMATCH: " + importPath + " in " + filePath);
          }
          break;
        }
      }
      if (!found && fs.existsSync(target) && fs.statSync(target).isDirectory()) {
         // directory import, skip
      } else if (!found) {
        console.log("NOT FOUND: " + importPath + " in " + filePath);
      }
    }
  }
}
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) checkFile(p);
  });
}
walk('./src');
console.log("Done checking imports.");
