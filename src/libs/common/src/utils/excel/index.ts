import { Workbook } from 'exceljs';
import { get } from 'lodash';
import moment from 'moment';
import { IExcelExportColumn } from '../../interfaces/excel';
import {
  cellTypeValidation,
  headerCellFont,
  headerCellStyle,
  headerLastCellStyle,
} from './config';

/**
 * Export Array of json data to excel
 * @date 4/3/2023
 * @author Sagar
 *
 * @async
 * @param {IExcelExportColumn[]} columns
 * @param {Record<string, any>[]} data
 * @param {?string} [sheetName]
 * @returns {unknown}
 */
export const exportDataToExcel = async (
  columns: IExcelExportColumn[],
  data: Record<string, any>[],
  sheetName?: string,
) => {
  const book = new Workbook();
  const sheet = book.addWorksheet(sheetName || 'data');

  const headerMap: Record<string, { col: number; defaultValue: string }> = {};

  columns.forEach((header, index) => {
    sheet.getColumn(index + 1).width = header.width || 30;

    const cell = sheet.getCell(1, index + 1);
    cell.value = header.label;
    cell.style =
      index === columns.length - 1 ? headerLastCellStyle : headerCellStyle;
    cell.font = headerCellFont;

    headerMap[header.key] = {
      defaultValue: header.defaultValue || '',
      col: index + 1,
    };
  });

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    for (const key of Object.keys(headerMap)) {
      const { col, defaultValue } = headerMap[key];
      const row = i + 2;
      const cell = sheet.getCell(row, col);
      const value = get(item, key) || defaultValue;
      if (value === 'date()') {
        cell.value = {
          formula: 'TODAY()',
          date1904: true,
          sharedFormula: 'TODAY()',
        };
        cell.numFmt = 'mm/dd/yyyy';
        continue;
      }
      cell.value = value;
    }
  }
  return book.xlsx.writeBuffer();
};

/**
 * Export Array of json data to excel for telemetry
 * @date 4/3/2023
 * @author Sagar
 *
 * @async
 * @param {IExcelExportColumn[]} columns
 * @param {Record<string, any>[]} data
 * @param {?boolean} [template]
 * @returns {unknown}
 */
export const exportTelemetryDataToExcel = async (
  columns: IExcelExportColumn[],
  data: Record<string, any>[],
  template?: boolean,
) => {
  let book = new Workbook();
  if (template) {
    book = await book.xlsx.readFile('resources/xlsx/sample.xlsx');
  }
  const sheet = book.addWorksheet('data');
  if (!template) {
    book.eachSheet((worksheet) => {
      if (worksheet.name !== 'data') {
        worksheet.state = 'veryHidden';
      }
    });
  } else if (template) {
    book.eachSheet((worksheet) => {
      if (
        worksheet.name !== 'data' &&
        !worksheet.name.toLowerCase().includes('measure')
      ) {
        worksheet.state = 'veryHidden';
      }
    });
  }

  const headerMap: Record<
    string,
    { col: number; defaultValue: string; type?: string }
  > = {};

  columns.forEach((header, index) => {
    sheet.getColumn(index + 1).width = header.width || 30;

    const cell = sheet.getCell(1, index + 1);
    cell.value = header.label;
    cell.style =
      index === columns.length - 1 ? headerLastCellStyle : headerCellStyle;
    cell.font = headerCellFont;

    headerMap[header.key] = {
      defaultValue: header.defaultValue || '',
      col: index + 1,
      type: header.type,
    };
  });

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    for (const key of Object.keys(headerMap)) {
      const { col, defaultValue, type } = headerMap[key];
      const row = i + 2;
      const cell = sheet.getCell(row, col);
      const value = get(item, key) || defaultValue;
      if (type) {
        cell.numFmt = cellTypeValidation[type].numFmt;
        cell.dataValidation = cellTypeValidation[type].validation;
        cell.value = value;

        if (type === 'date')
          cell.value =
            defaultValue === 'today' && value === defaultValue
              ? moment().format('MM/DD/YYYY')
              : value;
        continue;
      }
      cell.value = value;
    }
  }
  return book.xlsx.writeBuffer();
};
