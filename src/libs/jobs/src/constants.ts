export enum TRACKER_JOB_STATUS {
  // 'Pending' | 'Running' | 'Success' | 'Failed' | 'Cancelled'
  PENDING = 'Pending',
  RUNNING = 'Running',
  SUCCESS = 'Success',
  FAILED = 'Failed',
  // CANCELLED = 'Cancelled',
}

export const TRACKER_JOB_COMPLETE_STATUSES = [
  TRACKER_JOB_STATUS.FAILED,
  TRACKER_JOB_STATUS.SUCCESS,
];

export class JobTrackerConstants {
  static readonly JobTrackerRepo = 'JobTracker/Constants/repo';
  static readonly JobLogsRepo = 'jobLoges/Constants/repo';
}
