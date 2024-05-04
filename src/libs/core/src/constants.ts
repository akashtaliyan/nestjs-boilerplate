export type GenericFunction = (...args: any[]) => any;
export type GenericClass = Record<string, any>;

export class CoreConstants {
  static eventEmitterName = 'corejs/event_emitter_name';
  static eventName = 'corejs/event_name';
  static eventJobName = 'corejs/queued_event_handler_job';

  static commandName = 'corejs/command_name';
  static commandOptions = 'corejs/command_options';

  static cacheOptions = 'corejs/cache_options';

  static coreOptions = 'corejs/core_options';

  static storageOptions = 'corejs/storage_options';

  static queueJobName = 'corejs/queue_job_name';
  static queueOptions = 'corejs/queue_options';

  static dbConnection = 'corejs/db_connection';

  static customValidationDecorators = 'corejs/custom_validation_decorators';
  static classOptionalProperties = 'corejs/class_optional_properties';
}

export class CoreEvents {
  static jobFailed = 'corejs/job_failed_event';
  static jobProcessed = 'corejs/job_processed';
  static jobProcessing = 'corejs/job_processing';
}
