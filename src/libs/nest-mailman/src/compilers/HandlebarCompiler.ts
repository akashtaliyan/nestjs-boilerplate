import { readFileSync } from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

import { MailCompiler, CompilerOptions } from './../interfaces';
import { TEMPLATE_HELPERS } from '../constants';

export class HandlebarCompiler implements MailCompiler {
  filePath: string;
  compilerOptions: CompilerOptions;

  constructor(filename: string, compilerOptions: CompilerOptions) {
    this.filePath = path.join(compilerOptions.configPath, `${filename}.hbs`);
    this.compilerOptions = compilerOptions;
  }

  compileMail(options: Record<string, any>) {
    const template = Handlebars.compile(readFileSync(this.filePath, 'utf-8'));
    const compiledHtml = template(options);
    return compiledHtml;
  }
}

Handlebars.registerHelper(TEMPLATE_HELPERS.APP_CONFIG, (key) => {
  const config = {
    baseUrl: process.env.APP_URL || 'http://localhost:3000',
    helpEmail: process.env.HELP_EMAIL || 'help@accacia.ai',
    serverUrl: process.env.SERVER_BASE_URL || 'http://localhost', // Add Server Url
  };

  return config[key] || '';
});
