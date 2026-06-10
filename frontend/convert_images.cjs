const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = path.join(__dirname, 'public', 'assets');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      // Skip favicon because it's best kept as PNG
      if (file === 'website-favicon.png' || file === 'favicon.png') continue;
      
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const newPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
        
        console.log(`Converting ${fullPath} to ${newPath}`);
        
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(newPath);
          
        // Delete original
        fs.unlinkSync(fullPath);
        console.log(`Deleted ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath).then(() => {
  console.log('Conversion complete.');
}).catch(err => {
  console.error('Error during conversion:', err);
});
