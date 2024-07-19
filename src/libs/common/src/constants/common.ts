import {
  imageFileFilter,
  jsonFileFilter,
  reportFileFilter,
  staticFileFilter,
} from '../utils';

export enum S3_DISKS {
  BULK_IMPORT = 'bulkImport',
  IMAGE = 'image',
  STATIC = 'static',
  REPORTS = 'reports',
}

export const JSON_FILE_INTERCEPTOR_OPTIONS = {
  fileFilter: jsonFileFilter,
  // 10 mb limit
  limits: { fileSize: 10 * 1024 * 1024 },
};
export const IMAGE_FILE_INTERCEPTOR_OPTIONS = {
  fileFilter: imageFileFilter,
  // 5 mb limit
  limits: { fileSize: 5 * 1024 * 1024 },
};
export const REPORT_FILE_INTERCEPTOR_OPTIONS = {
  fileFilter: reportFileFilter,
  // 10 mb limit
  limits: { fileSize: 10 * 1024 * 1024 },
};

export const STATIC_FILE_INTERCEPTOR_OPTIONS = {
  fileFilter: staticFileFilter,
  // 500 mb limit
  limits: { fileSize: 500 * 1024 * 1024 },
};

export const EXTERNAL_PROVIDERS = {
  GOOGLE: 'google',
  // FACEBOOK: 'facebook',
  // LINKEDIN: 'linkedin',
};
