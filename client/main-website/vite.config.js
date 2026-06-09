import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Auto-copy CEO image from AppData to public folder
try {
  const sourcePath = 'C:\\Users\\Karan Purkait\\.gemini\\antigravity\\brain\\497be3b7-9e9a-4d6e-8622-0bc526c32772\\.tempmediaStorage\\media_497be3b7-9e9a-4d6e-8622-0bc526c32772_1780578820916.jpg';
  const destPath = './public/ceo.jpg';
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log('Successfully copied CEO picture to public/ceo.jpg');
  }
} catch (err) {
  console.error('Failed to auto-copy CEO picture:', err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
