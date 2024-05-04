import { Request } from '@libs/core';
import { Storage } from '@libs/nestjs-storage';
import { UnprocessableEntityException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { S3_DISKS } from '../constants';

export const getS3PreSignedUrls = (n = 1) => {
  const disk = Storage.disk(S3_DISKS.BULK_IMPORT);
  const id = uuidv4();
  const urls = [];
  for (let i = 0; i < n; i++) {
    urls.push(disk.signedUrl(id, 10));
  }
  return urls;
};

export const jsonFileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: (e: Error, acceptFile: boolean) => void,
) => {
  if (file.mimetype !== 'application/json') {
    return cb(null, false);
  }
  cb(null, true);
};
export const imageFileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: (e: Error, acceptFile: boolean) => void,
) => {
  const validFileTypes = new Set(['image/png', 'image/jpeg', 'image/jpg']);
  if (!validFileTypes.has(file.mimetype)) {
    return cb(null, false);
  }
  cb(null, true);
};

export const staticFileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: (e: Error, acceptFile: boolean) => void,
) => {
  const validFileTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg',
    'image/svg+xml', // added support for svg/xml by @akash
    'application/pdf',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json',
    'application/csv',
    'application/octet-stream', // Allowing binary data to be stored as well. Required for templates
  ]);
  if (!validFileTypes.has(file.mimetype)) {
    return cb(null, false);
  }
  cb(null, true);
};

export const uploadJSONFileToS3 = async (file: string, uuid?: string) => {
  const disk = Storage.disk(S3_DISKS.BULK_IMPORT);
  const id = uuid || uuidv4();
  const filePath = `${id}.json`;
  const url = await disk.put(filePath, file);
  return url;
};
export const uploadImageToS3 = async (
  file: Express.Multer.File,
  uuid?: string,
) => {
  const disk = Storage.disk(S3_DISKS.IMAGE);
  const id = uuid || uuidv4();
  const filePath = `${id}`;
  const url = await disk.put(filePath, file.buffer);
  return url;
};

export const getImageFromS3 = async (id?: string): Promise<Buffer> => {
  const disk = Storage.disk(S3_DISKS.IMAGE);
  const filePath = `${id}`;
  return disk.get(filePath);
};
export const getPdfFromS3 = async (id?: string): Promise<Buffer> => {
  const disk = Storage.disk(S3_DISKS.REPORTS);
  const filePath = `${id}`;
  return disk.get(filePath);
};

export const getStaticFileFromS3 = async (slug?: string): Promise<Buffer> => {
  const disk = Storage.disk(S3_DISKS.STATIC);
  const filePath = `${S3_DISKS.STATIC}/${slug}`;
  return disk.get(filePath);
};

export const saveStaticFileToS3 = async (
  file: Express.Multer.File,
  slug?: string,
): Promise<boolean> => {
  const disk = Storage.disk(S3_DISKS.STATIC);
  const filePath = `${S3_DISKS.STATIC}/${slug}`;
  const url = await disk.put(filePath, file.buffer);
  if (!url.url) return false;
  return true;
};

/**
 * Function to filter the file type for a report input file
 */
export const reportFileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: (e: Error, acceptFile: boolean) => void,
) => {
  const validFileTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);
  if (!validFileTypes.has(file.mimetype)) {
    return cb(null, false);
  }
  cb(null, true);
};

/**
 * Function to upload the file buffer to the s3 for a report input file
 */
export const uploadReportFileToS3 = async (
  file: Express.Multer.File,
  uuid: string,
  companyId: string,
) => {
  const disk = Storage.disk(S3_DISKS.REPORTS);
  const id = uuid;
  const filePath = `reports_file_inputs/${companyId}/${getReportFileId(
    file,
    id,
  )}`;
  await disk.put(filePath, file.buffer);
  return filePath;
};

/**
 * Function to get the file id for a report input file
 */
export const getReportFileId = (file: Express.Multer.File, id?: string) => {
  const uuid = id || uuidv4();
  return `s3+${file.mimetype.replaceAll('/', '_')}+${uuid}`;
};

/**
 * Function to split the file id into mimeType and uuid for a report input file
 */
export const splitReportFileId = (id: string) => {
  const [_, mimeType, uuid] = id.split('+') || [];
  if (!mimeType || !uuid)
    throw new UnprocessableEntityException('Invalid file id');
  return { mimeType: mimeType, uuid };
};

/**
 * Function to get the file buffer from s3 for a report input file
 */
export const getReportInputFileFromS3 = async (
  id: string,
  companyId: string,
): Promise<{ buffer: Buffer; mimeType: string }> => {
  const { mimeType } = splitReportFileId(id);
  const disk = Storage.disk(S3_DISKS.REPORTS);
  const filePath = `reports_file_inputs/${companyId}/${id}`;
  return { buffer: await disk.get(filePath), mimeType };
};
