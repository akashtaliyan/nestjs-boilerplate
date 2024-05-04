import { DefaultValue } from '@libs/core/validator';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import moment from 'moment';
import { TRACKER_JOB_STATUS } from '../constants';
export class GetJobsDto {
  @IsEnum(TRACKER_JOB_STATUS)
  @IsNotEmpty()
  @IsOptional()
  status?: TRACKER_JOB_STATUS;

  @Transform(({ value }) =>
    moment(value).isValid() ? moment(value).startOf('day').toDate() : null,
  )
  @IsOptional()
  from?: Date;

  @Transform(({ value }) =>
    moment(value).isValid() ? moment(value).endOf('day').toDate() : null,
  )
  @IsOptional()
  to?: Date;

  @IsNumber()
  @Transform(({ value }) => +value)
  @DefaultValue(1)
  page?: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @DefaultValue(100)
  perPage?: number;

  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  @IsOptional()
  q?: string;
}
