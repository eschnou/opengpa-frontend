
/**
 * This is a helper script to generate the PWA icons.
 * You can run it with Node.js once you have copied the OpenGPA logo to this directory.
 * 
 * Requirements:
 * - Install sharp: npm install sharp
 * - Copy your opengpa_logo.svg to this directory
 * - Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceFile = path.join(__dirname, 'opengpa_logo.svg');

if (!fs.existsSync(sourceFile)) {
  console.error('Source file not found:', sourceFile);
  process.exit(1);
}

async function generateIcons() {
  // Create maskable icon
  await sharp(sourceFile)
    .resize(512, 512)
    .toFile(path.join(__dirname, 'maskable-icon.png'));
  
  // Create regular icons
  for (const size of sizes) {
    await sharp(sourceFile)
      .resize(size, size)
      .toFile(path.join(__dirname, `icon-${size}x${size}.png`));
  }
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(err => console.error('Error generating icons:', err));
