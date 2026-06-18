const fs = require('fs');
fs.mkdirSync('client/becs-store/public/images', { recursive: true });
const dir = '/home/sujay-barman/.gemini/antigravity/brain/40cc1750-a016-4381-ab0e-d64ec4d78d11/';
const files = fs.readdirSync(dir);
const imageFiles = files.filter(f => f.endsWith('.png'));

imageFiles.forEach(f => {
  // Strip the timestamp part (e.g., _1781763817660.png)
  const newName = f.replace(/_\d+\.png$/, '.png');
  fs.copyFileSync(`${dir}${f}`, `client/becs-store/public/images/${newName}`);
});
console.log('Images copied successfully.');
