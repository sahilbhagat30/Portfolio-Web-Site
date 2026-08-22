const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('/Users/sahilbhagat/Desktop/Portfolio/scratch/screenshot1.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    let textFound = false;
    // Check left half of image for non-black pixels
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width / 2; x++) {
        let idx = (this.width * y + x) << 2;
        let r = this.data[idx];
        let g = this.data[idx+1];
        let b = this.data[idx+2];
        if (r > 100 && g > 100 && b > 100) {
          textFound = true;
          break;
        }
      }
      if (textFound) break;
    }
    console.log('Text found on left side:', textFound);
  });
