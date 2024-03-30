import moment from 'moment';

/**
 * Get fiscal quarter of a date (1-4) By default, the fiscal year starts in January.
 * You can specify a different month to start the fiscal year.
 * @param date Date
 * @param opt_monthStart Month to start the fiscal year
 * @returns Fiscal quarter of a date (1-4)
 *
 * @example
 * fiscalQuarter(new Date('2021-01-01')) // 1
 * fiscalQuarter(new Date('2021-04-01')) // 2
 * fiscalQuarter(new Date('2021-07-01')) // 3
 * fiscalQuarter(new Date('2021-10-01')) // 4
 * fiscalQuarter(new Date('2021-04-01'), 3) // 1
 * fiscalQuarter(new Date('2021-07-01'), 3) // 2
 * fiscalQuarter(new Date('2021-10-01'), 3) // 3
 * fiscalQuarter(new Date('2022-03-01'), 3) // 4
 */
export const fiscalQuarter = (date: Date, opt_monthStart = 0) => {
  const month = date.getMonth(),
    monthIndex = (month - opt_monthStart + 12) % 12;
  return ~~(monthIndex / 3) + 1;
};

/**
 * Get start date fiscal year. By default, the fiscal year starts in January.
 * @param financialYear Fiscal year (e.g. JAN-DEC, APR-MAR)
 * @param year year for which fiscal year start is required
 * @returns fiscalYearStart: Moment, fiscalYearEnd: Moment
 * @example
 * getFinancialYearStart('JAN-DEC', 2021) // {fiscalYearStart:2021-01-01T00:00:00, fiscalYearEnd:2021-12-31T23:59:59}
 * getFinancialYearStart('APR-MAR', 2021) // {fiscalYearStart:2021-04-01T00:00:00, fiscalYearEnd:2022-03-31T23:59:59}
 * getFinancialYearStart('JAN-DEC', 2022) // {fiscalYearStart:2022-01-01T00:00:00, fiscalYearEnd:2022-12-31T23:59:59}
 * getFinancialYearStart('APR-MAR', 2022) // {fiscalYearStart:2022-04-01T00:00:00, fiscalYearEnd:2023-03-31T23:59:59}
 */
export const getFinancialYearStartAndEnd = (
  financialYear: string,
  year = new Date().getFullYear(),
) => {
  const startMonth = financialYear?.split('-')?.[0];
  const startYearMonthIdx =
    FINANCIAL_YEAR_TO_MONTH_IDX[
      startMonth as any as keyof typeof FINANCIAL_YEAR_TO_MONTH_IDX
    ];

  let fiscalYearStart = moment().year(year).startOf('year'); // set fiscal year to default start of year.
  if (startYearMonthIdx !== undefined) {
    // if we have custom starting point for fiscal year take that.
    fiscalYearStart = moment()
      .clone()
      .year(year)
      .set('month', startYearMonthIdx)
      .startOf('month');

    if (fiscalYearStart.isAfter(moment())) {
      // if fiscal year start is after today then take the last year.
      fiscalYearStart = fiscalYearStart.subtract(1, 'year');
    }
  }

  return {
    fiscalYearStart: fiscalYearStart,
    fiscalYearEnd: fiscalYearStart.clone().add(11, 'months').endOf('month'),
  };
};

export enum FINANCIAL_YEAR_TO_MONTH_IDX {
  JAN,
  FEB,
  MAR,
  APR,
  MAY,
  JUN,
  JUL,
  AUG,
  SEP,
  OCT,
  NOV,
  DEC,
}
