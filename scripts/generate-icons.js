import fs from 'fs';
import path from 'path';
import { renderAsync } from '@resvg/resvg-js';

const publicDir = path.resolve(process.cwd(), 'public');
const svgPath = path.join(publicDir, 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating PWA and iOS PNG icons...');

  // 1. apple-touch-icon.png (180x180)
  const res180 = await renderAsync(svgBuffer, {
    fitTo: { mode: 'width', value: 180 },
  });
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), res180.asPng());
  console.log('Created apple-touch-icon.png (180x180)');

  // 2. pwa-192x192.png
  const res192 = await renderAsync(svgBuffer, {
    fitTo: { mode: 'width', value: 192 },
  });
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), res192.asPng());
  console.log('Created pwa-192x192.png (192x192)');

  // 3. pwa-512x512.png
  const res512 = await renderAsync(svgBuffer, {
    fitTo: { mode: 'width', value: 512 },
  });
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), res512.asPng());
  console.log('Created pwa-512x512.png (512x512)');

  // 4. pwa-maskable-512x512.png (with padding for Android safe zone)
  const maskableSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <rect width="512" height="512" fill="#065f46"/>
      <g transform="translate(51, 51) scale(0.8)">
        ${svgBuffer.toString().replace(/<\?xml.*?\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
      </g>
    </svg>
  `;
  const resMaskable = await renderAsync(Buffer.from(maskableSvg), {
    fitTo: { mode: 'width', value: 512 },
  });
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), resMaskable.asPng());
  console.log('Created pwa-maskable-512x512.png (512x512)');

  console.log('All icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
