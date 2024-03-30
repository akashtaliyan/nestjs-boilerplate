import { Module } from '@nestjs/common';
import {
  NunjucksTemplateCompilerService,
  TemplateEngineRenderService,
  TemplateEngineService,
} from './services';

@Module({
  imports: [],
  providers: [
    NunjucksTemplateCompilerService,
    TemplateEngineRenderService,
    TemplateEngineService,
  ],
  exports: [
    NunjucksTemplateCompilerService,
    TemplateEngineRenderService,
    TemplateEngineService,
  ],
})
export class TemplateEngineModule {}
