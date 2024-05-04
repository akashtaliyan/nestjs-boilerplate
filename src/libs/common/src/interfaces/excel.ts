import { Font, Style } from 'exceljs';

export interface IExcelExportColumn {
  key?: string;
  label?: string;
  style?: Partial<Style>;
  width?: number;
  font?: Partial<Font>;
  defaultValue?: string;
  type?: 'date' | 'number' | 'string';
}
