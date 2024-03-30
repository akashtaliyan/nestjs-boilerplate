import { RestServer } from '@libs/core';
import { AppModule } from './app';

RestServer.make(AppModule, {
  addValidationContainer: true,
});
