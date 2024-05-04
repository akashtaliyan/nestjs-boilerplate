import { getStaticFileFromS3 } from '@libs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { round } from 'lodash';
import { Environment, renderString } from 'nunjucks';

/**
 * A class containing helper functions for nunjucks template engine (compiler)
 */
@Injectable()
export class NunjucksTemplateCompilerService {
  public env: Environment;
  static loadedTemplates: Record<string, string> = {};

  constructor() {
    this.env = new Environment();
    this.addDefaultExtension();
    this.addDefaultFilters();
  }

  /**
   * Load a template from s3 and compile it directly
   */
  async loadTemplateFromS3(path: string, name = path) {
    const templateBuffer = await getStaticFileFromS3(path);
    const templateStr = templateBuffer?.toString('utf-8');
    if (!templateStr) {
      return this;
    }
    this.loadTemplate(name, templateStr);
    return this;
  }

  /**
   * Load a template and compile it directly
   */
  loadTemplate(name: string, template: string) {
    NunjucksTemplateCompilerService.loadedTemplates[name] = template;
    return this;
  }

  /**
   * Get a precompiled template
   */
  async getTemplate(name: string) {
    return NunjucksTemplateCompilerService.loadedTemplates[name];
  }

  /**
   * Render the compiled template with given context
   */
  async renderHtml(template: string, data: any = {}) {
    if (!NunjucksTemplateCompilerService.loadedTemplates[template]) {
      throw new NotFoundException(
        `Template '${template}' has not been loaded yet. Please load it first`,
      );
    }

    const rendered = renderString(
      NunjucksTemplateCompilerService.loadedTemplates[template],
      {
        ...data,
        isTrue: isObjectTrueDeep,
        getAppConfig,
        isChecked: isObjectCheckedDeep,
        roundOff: round,
      }, // passing helper functions
    );

    return rendered;
  }

  /**
   * Add Some default filter if needed
   */
  addDefaultFilters(): NunjucksTemplateCompilerService {
    return this;
  }

  /**
   * Add Some Default extension if needed
   */
  addDefaultExtension() {
    return this;
  }
}

/**
 * Function to check if any of its value is true or not. Using it for reports as it can have nested data so we need a way to validate the top level data
 */
const checkRecursiveIfTrue = (obj) => {
  return Object.values(obj || {}).some((el = null) =>
    typeof el === 'object' ? checkRecursiveIfTrue(el) : el,
  );
};

export const isObjectTrueDeep = (obj: any): boolean => {
  if (typeof obj !== 'object') return !!obj;
  if (Array.isArray(obj)) return obj.length > 0;
  if (obj === null || obj === undefined) return false;

  return Object.values(obj || {}).some(isObjectTrueDeep);
};

export const isObjectCheckedDeep = (obj: any) => {
  if (typeof obj !== 'object') return !!obj ? 'checked' : '';
  if (Array.isArray(obj)) return obj.length > 0 ? 'checked' : '';
  if (obj === null || obj === undefined) return false ? 'checked' : '';

  return Object.values(obj || {}).some(isObjectTrueDeep) ? 'checked' : '';
};

/**
 * Function to get app config
 */
const getAppConfig = (key) => {
  const config = {
    baseUrl: process.env.APP_URL || 'http://localhost:3000',
    helpEmail: process.env.HELP_EMAIL || 'help@accacia.ai',
  };

  return config[key] || '';
};
