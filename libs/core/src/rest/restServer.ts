import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { rateLimit } from 'express-rate-limit';
import { startCase } from 'lodash';
import { ExceptionFilter } from '../exceptions';
import { RequestGuard } from './guards';
import { ServerOptions } from './interfaces';
import { TimeoutInterceptor } from './timeoutInterceptor';
import { ClsMiddleware, ClsServiceManager } from 'nestjs-cls';
import { RequestContextInterceptor } from '../interceptors';
import { json, urlencoded } from 'express';

export class RestServer {
  private module: any;
  private options: ServerOptions;
  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */
  static async make(module: any, options?: ServerOptions): Promise<void> {
    const app = await NestFactory.create(module, { rawBody: options.rawBody });
    const appConfig = app.get(ConfigService, {
      strict: false,
    });

    const inProduction = +process.env.IS_PROD;

    if (!inProduction) {
      const documentBuilder = new DocumentBuilder()
        .setTitle(process.env.PRODUCT_NAME || 'nestjs-boilerplate')
        .setVersion('1.0');

      const description = ` `;

      documentBuilder.setDescription(description);

      const swaggerCustomOptions: SwaggerCustomOptions = {
        swaggerOptions: {
          persistAuthorization: true,
        },
      };
      const document = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
      );
      SwaggerModule.setup('api', app, document, swaggerCustomOptions);
    }

    // Not for eks only for the node process
    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    options.globalPrefix && app.setGlobalPrefix(options.globalPrefix);
    app.use(rateLimit({ windowMs: 60, max: 50 }));
    // TODO enable for security
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://192.168.1.9:3000',
      ],
    });

    // Initialize cls middleware to save request and generate id
    app.use(
      new ClsMiddleware({
        saveReq: true,
        generateId: true,
      }).use,
    );

    // Initialize interceptor
    app.useGlobalInterceptors(
      new RequestContextInterceptor(ClsServiceManager.getClsService()),
    );
    app.use(json({ limit: '10mb' })); // Increase limit to 10 mb

    app.useGlobalGuards(new RequestGuard());
    // app.use('trust proxy', true);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.listen(options.port || appConfig.get<number>('app.port'));
  }
}
