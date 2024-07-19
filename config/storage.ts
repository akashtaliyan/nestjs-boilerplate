import { StorageOptions } from '@libs/nestjs-storage';
import { registerAs } from '@nestjs/config';

// Changing the default so that each bucket can have different config
export default registerAs('storage', () => {
  return {
    default: 'bulkImport',
    disks: {
      bulkImport: {
        driver: 's3',
        region: process.env.AWS_REGION,
        bucket: process.env.BULK_IMPORT_BUCKET,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      image: {
        driver: 's3',
        accessKeyId:
          process.env.IMAGE_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          process.env.IMAGE_AWS_SECRET_ACCESS_KEY ||
          process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.IMAGE_AWS_REGION || process.env.AWS_REGION,
        bucket: process.env.IMAGE_BUCKET || process.env.BULK_IMPORT_BUCKET,
      },
      static: {
        driver: 's3',
        accessKeyId:
          process.env.STATIC_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          process.env.STATIC_AWS_SECRET_ACCESS_KEY ||
          process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket:
          process.env.STATIC_FILES_BUCKET || process.env.BULK_IMPORT_BUCKET,
      },
      reports: {
        driver: 's3',
        accessKeyId:
          process.env.REPORTS_AWS_ACCESS_KEY_ID ||
          process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          process.env.REPORTS_AWS_SECRET_ACCESS_KEY ||
          process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.REPORTS_AWS_REGION || process.env.AWS_REGION,
        bucket: process.env.REPORTS_BUCKET || process.env.BULK_IMPORT_BUCKET,
      },
      docuBox: {
        driver: 's3',
        accessKeyId:
          process.env.DOCU_BOX_AWS_ACCESS_KEY_ID ||
          process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          process.env.DOCU_BOX_AWS_SECRET_ACCESS_KEY ||
          process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.DOCU_BOX_AWS_REGION || process.env.AWS_REGION,
        bucket: process.env.DOCU_BOX_BUCKET || process.env.BULK_IMPORT_BUCKET,
      },
    },
  } as StorageOptions;
});
