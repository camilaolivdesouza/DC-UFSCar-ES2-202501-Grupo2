import { constructFrom } from "../constructFrom/index.js";
import { toDate } from "../toDate/index.js";
import type { ContextOptions, DateArg } from "../types.js";

/**
 * The {@link addDays} function options.
 */
export interface AddDaysOptions<DateType extends Date = Date>
  extends ContextOptions<DateType> {
  /** An array of dates to exclude from the count. Weekends are also automatically excluded. */
  excludedDates?: Array<DateArg<DateType>>;
}

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of business days to the given date.
 *
 * @description
 * Add the specified number of business days to the given date, excluding weekends and any custom dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be added.
 * @param options - An object with options
 *
 * @returns The new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 *
 * @example
 * // Add 10 business days to 1 September 2014, excluding a holiday:
 * const result = addDays(new Date(2014, 8, 1), 10, {
 * excludedDates: [new Date(2014, 8, 5)]
 * })
 * //=> Mon Sep 16 2014 00:00:00
 */
export function addDays(
  date: Date,
  amount: number,
  options?: { excludedDates?: Date[] }
): Date {
  const result = new Date(date);
  const direction = amount >= 0 ? 1 : -1;

  let remaining = Math.abs(amount);

  const isWeekend = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6;

  const isExcluded = (d: Date): boolean => {
    if (!options?.excludedDates) return false;

    return options.excludedDates.some((excluded) =>
      excluded.toDateString() === d.toDateString()
    );
  };

  while (remaining > 0) {
    result.setDate(result.getDate() + direction);

    if (isWeekend(result) || isExcluded(result)) {
      continue;
    }

    remaining--;
  }

  return result;
}