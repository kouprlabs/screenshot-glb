import {firefox} from 'playwright';
import {performance} from 'perf_hooks';
import {CaptureScreenShotOptions} from './types/CaptureScreenshotOptions';
import {timeDelta} from './time-delta';
import {renderScreenshot} from './render-screenshot';

export async function captureScreenshot(options: CaptureScreenShotOptions) {
  const browserT0 = performance.now();
  const {
    inputUrls,
    outputPaths,
    backgroundColors,
    modelViewerArgs,
    modelViewerUrl,
    width,
    height,
    quality,
    formatExtension,
  } = options;

  const browser = await firefox.launch({
    headless: true,
    firefoxUserPrefs: {
      "webgl.force-enabled": true,
      "webgl2.force-enabled": true,
    },
    args: [
      '--use-gl=swiftshader',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-software-rasterizer',
      `--window-size=${width},${height}`,
    ]
  });

  const browserT1 = performance.now();
  let captureTime = 0;

  console.log(`🚀  Launched browser (${timeDelta(browserT0, browserT1)}s)`);

  const page = await browser.newPage();
  await page.setViewportSize({ width, height });

  page.on('console', async (message) => {
    const args = await Promise.all(
      message.args().map((arg) => arg.jsonValue()),
    );

    if (args.length) {
      console.log(`➡️`, ...args);
    }
  });

  for (let i = 0; i < inputUrls.length; i++) {
    try {
      await renderScreenshot({
        inputPath: inputUrls[i],
        outputPath: outputPaths[i],
        backgroundColor: backgroundColors[i],
        modelViewerArgs: modelViewerArgs[i],
        quality,
        formatExtension,
        modelViewerUrl,
        page,
        options,
      });

      captureTime = performance.now();
    } catch (error) {
      console.log('❌  Closing browser because of error:', error);

      browser.close();
    }
  }

  browser.close();
  console.log(
    `🪂  Closed browser (${timeDelta(captureTime, performance.now())}s)`,
  );
}
