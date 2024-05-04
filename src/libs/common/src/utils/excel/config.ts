import { DataValidation, Style } from 'exceljs';

export const headerCellStyle = {
  fill: {
    bgColor: {
      argb: 'ff00b593',
    },
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: 'ff00b593',
    },
  },
  border: {
    bottom: {
      style: 'thin',
    },
    top: {
      style: 'thin',
    },
    left: {
      style: 'thin',
    },
  },
} as Partial<Style>;

export const headerLastCellStyle = {
  ...headerCellStyle,
  border: {
    ...headerCellStyle.border,
    right: {
      style: 'thin',
    },
  },
} as Partial<Style>;

export const dataCellStyle = {
  border: {
    bottom: {
      style: 'thin',
    },

    top: {
      style: 'thin',
    },

    left: {
      style: 'thin',
    },

    right: {
      style: 'thin',
    },
  },
} as Partial<Style>;

export const headerCellFont = {
  bold: true,
  color: {
    argb: 'FFFFFFFF',
  },
};

export const cellErrorValidation = {
  type: 'list',
  errorTitle: 'Invalid Input',
  error: 'Your input is not in the list',
  errorStyle: 'stop',
  showErrorMessage: true,
} as DataValidation;

// Cell Validation based on type of cell
export const cellTypeValidation: Record<
  string,
  { validation: DataValidation; numFmt: string }
> = {
  date: {
    validation: {
      type: 'date',
      formulae: [],
      showErrorMessage: true,
      error: 'Please enter a valid date',
    },
    numFmt: 'mm/dd/yyyy',
  },
  number: {
    validation: {
      type: 'decimal',
      formulae: [],
      showErrorMessage: true,
      error: 'Please enter a valid number',
    },
    numFmt: '',
  },
  integer: {
    validation: {
      type: 'whole',
      formulae: [],
      showErrorMessage: true,
      error: 'Please enter a valid integer',
    },
    numFmt: '0',
  },
};
