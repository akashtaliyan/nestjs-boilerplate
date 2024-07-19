import { RestServer, StandaloneApp } from '@libs/core';
import { CronCaptainModule } from './module';

StandaloneApp.make(CronCaptainModule, {
  addValidationContainer: true,
});
