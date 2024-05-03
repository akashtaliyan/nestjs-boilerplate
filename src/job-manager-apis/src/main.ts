import { RestServer } from '@libs/core';

import { JobManagerApisModule } from './module';

RestServer.make(JobManagerApisModule, {
  addValidationContainer: true,
  port: +process.env.FEATURE_FLAG_MODULE_PORT || 6011,

  globalPrefix: process.env.FEATURE_FLAG_MODULE_PREFIX || '',
});
