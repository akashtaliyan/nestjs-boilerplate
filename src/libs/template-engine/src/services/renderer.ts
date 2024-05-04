import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import puppeteer, { PDFOptions } from 'puppeteer';

/**
 * A class containing helper functions for puppeteer
 */
@Injectable()
export class TemplateEngineRenderService {
  async generatePdf(htmlStr: string, config: { options?: PDFOptions } = {}) {
    // puppeteer options for pdf
    const options: PDFOptions = {
      headerTemplate: '<p></p>',
      footerTemplate: '<p></p>',
      displayHeaderFooter: false,
      margin: {
        top: '50px', // Update the the margin
        bottom: '12px',
        left: '50px',
        right: '50px',
      },
      printBackground: true,
      format: 'A4',
      ...(config.options && config.options),
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-gpu'],
      executablePath: process.env.CHROME_BIN || undefined,
    });
    try {
      const page = await browser.newPage();
      await page.setContent(htmlStr); // Set the content of page to html

      const scrollDimension = await page.evaluate(() => {
        return {
          width: document.scrollingElement.scrollWidth,
          height: document.scrollingElement.scrollHeight,
        };
      }); // Set the scroll dimensions
      await page.setViewport({
        width: scrollDimension.width,
        height: scrollDimension.height,
      }); // Set the viewport dimensions

      const pdfBufferData = await page.pdf(options); // convert the html page to pdf
      +process.env.DEBUG_PDF_GENERATION &&
        writeFileSync('new.pdf', pdfBufferData);

      return pdfBufferData;
    } catch (error) {
      console.log(error);
    } finally {
      await browser.close(); // close the browser
    }
  }
}
