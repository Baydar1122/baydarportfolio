import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const playwrightPath = 'C:/Users/Baydar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core';
const { chromium } = require(playwrightPath);

const distDir = path.resolve('dist');
const screenshotDir = path.join(distDir, 'screenshots');
const artifactDir = 'C:/Users/Baydar/.gemini/antigravity-ide/brain/b6597f81-305d-42fa-a1e8-102f864860d7';

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

function serveStatic(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2'
  };

  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(serveStatic);
const PORT = 4322;

server.listen(PORT, async () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
  
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const viewports = [
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 900 }
  ];

  for (const vp of viewports) {
    // Light mode
    const pageLight = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, colorScheme: 'light' });
    await pageLight.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    const lightPath = path.join(screenshotDir, `home-${vp.name}-light.png`);
    await pageLight.screenshot({ path: lightPath, fullPage: true });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(lightPath, path.join(artifactDir, `home-${vp.name}-light.png`));
    }
    await pageLight.close();

    // Dark mode
    const pageDark = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, colorScheme: 'dark' });
    await pageDark.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await pageDark.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const darkPath = path.join(screenshotDir, `home-${vp.name}-dark.png`);
    await pageDark.screenshot({ path: darkPath, fullPage: true });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(darkPath, path.join(artifactDir, `home-${vp.name}-dark.png`));
    }
    await pageDark.close();
  }

  // Project detail page screenshot
  const pageProject = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  await pageProject.goto(`http://localhost:${PORT}/projects/pro-pk/`, { waitUntil: 'networkidle' });
  const projPath = path.join(screenshotDir, `project-pro-pk-desktop-light.png`);
  await pageProject.screenshot({ path: projPath, fullPage: true });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(projPath, path.join(artifactDir, `project-pro-pk-desktop-light.png`));
  }
  await pageProject.close();

  await browser.close();
  server.close();
  console.log('✓ Captured responsive screenshots across viewports in light and dark themes.');
});
