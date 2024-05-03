export type Payload = Record<string, any> | string | number;

export interface JobOptions {
  delay?: number;
  tries?: number;
  queue?: string;
  timeout?: number;
  connection?: string;
}

export interface Message extends JobOptions {
  job: string;
  data: Payload | Payload[];
  id?: string;
}

export interface InternalMessage extends Message {
  attemptCount: number;
}
