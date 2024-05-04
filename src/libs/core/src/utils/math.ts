// Helpers for basic math calculations.
export class MathHelpers {
  /**
   * Function: add a percentage of a number to that number.
   *
   * @param num number
   * @param percent percent of number which is to be added.
   *
   */
  static addPercent(num: number, percent: number): number {
    return num * (1 + percent / 100);
  }

  /**
   * Function: calculate percentage of a number by percent.
   *
   * @param num number
   * @param percent percent of number which is to be calculated.
   *
   */
  static percentage(num: number, percent: number): number {
    return num * (percent / 100);
  }

  /**
   * Function: multiply the numbers passed as arguments.
   *
   * @param a numbers which have to be multiplied.
   *
   */
  static mul(...a: number[]): number {
    let b = 1;
    for (const x of a) {
      b *= parseFloat(x as unknown as string);
    }
    return b;
  }
  /**
   * Function: add all the numbers passed as arguments.
   *
   * @param a numbers which have to be added.
   *
   */
  static add(...a: number[]): number {
    let b = 0;
    for (const x of a) b += x || 0;
    return b;
  }
}
