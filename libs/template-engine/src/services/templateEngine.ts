import { Injectable } from '@nestjs/common';
import { PDFOptions } from 'puppeteer';
import { NunjucksTemplateCompilerService } from './nunjucks';
import { TemplateEngineRenderService } from './renderer';

/**
 * A class containing all the function that we need for generating a template
 */
@Injectable()
export class TemplateEngineService {
  constructor(
    public templateCompiler: NunjucksTemplateCompilerService,
    public renderer: TemplateEngineRenderService,
  ) {}

  /**
   * Generate the pdf by getting the template from s3
   */
  async generatePdfFromS3Template(
    templatePath: string,
    context: Record<any, any>,
  ) {
    await this.templateCompiler.loadTemplateFromS3(templatePath); // Load the template

    const renderedHtml = await this.templateCompiler.renderHtml(
      templatePath,
      context,
    ); // render the template to html using the context passed to the function

    const pdfBufferData = await this.renderer.generatePdf(renderedHtml, {
      options: {
        // Add header and footer
        headerTemplate: `<span style="width:100%;margin-left:85%; opacity: 0.5; margin-bottom:10px;"> <img style="width: 78px;" src="${headerImage}" alt="accacia_logo"/></span>`,
        footerTemplate: `<span style="font-size: 10px; width:100%;margin-left:90%;"> <span class="pageNumber"></span> of <span class="totalPages"></span></span>`,
        displayHeaderFooter: true,
      },
    }); // Generate the file buffer for the pdf

    return pdfBufferData;
  }

  /**
   * Generate the pdf from passed string template instead of getting from s3
   */
  async generatePdf(
    template: string,
    context: Record<any, any>,
    config?: { options?: PDFOptions; templateName?: string },
  ) {
    this.templateCompiler.loadTemplate(
      config?.templateName || 'default',
      template,
    );

    const renderedHtml = await this.templateCompiler.renderHtml(
      config?.templateName || 'default',
      context,
    );

    const pdfBufferData = await this.renderer.generatePdf(renderedHtml, config);

    return pdfBufferData;
  }
}
// Accacia image for headers
const headerImage = `data:image/png;base64,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`;
