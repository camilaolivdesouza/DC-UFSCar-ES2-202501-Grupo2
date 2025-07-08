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
export function addDays<
  DateType extends Date,
  ResultDate extends Date = DateType,
>(
  date: DateArg<DateType>,
  amount: number,
  options?: AddDaysOptions<ResultDate>,
): ResultDate {
  const _date = toDate(date, options?.in);
  const _amount = Math.trunc(amount);

  if (isNaN(_amount)) return constructFrom(options?.in || date, NaN) as ResultDate;

  // Se a quantidade for 0 ou não houver datas para excluir, usa a lógica original.
  // Isso garante a retrocompatibilidade.
  if (!_amount || !options?.excludedDates?.length) {
    const newDate = toDate(date, options?.in);
    if (!amount) return newDate; // Retorna uma nova instância se a quantidade for 0
    newDate.setDate(newDate.getDate() + _amount);
    return newDate;
  }

  const newDate = toDate(date, options?.in);
  const direction = _amount > 0 ? 1 : -1;
  let daysAdded = 0;

  // Converte as datas excluídas para timestamps para facilitar a comparação
  const excludedTimestamps = (options.excludedDates || []).map((d) =>
    toDate(d, options?.in).getTime(),
  );

  while (daysAdded < Math.abs(_amount)) {
    newDate.setDate(newDate.getDate() + direction);
    const day = newDate.getDay();
    const isWeekend = day === 0 || day === 6; // Domingo ou Sábado

    // Normaliza a data para a meia-noite para comparar com as datas excluídas
    const currentDateAtMidnight = new Date(newDate);
    currentDateAtMidnight.setHours(0, 0, 0, 0);

    const isExcluded = excludedTimestamps.some(
      (timestamp) => timestamp === currentDateAtMidnight.getTime(),
    );

    if (!isWeekend && !isExcluded) {
      daysAdded++;
    }
  }

  return newDate;
}