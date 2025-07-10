import { constructFrom } from "../constructFrom/index.js";
import { toDate } from "../toDate/index.js";
import type { ContextOptions, DateArg } from "../types.js";

/**
 * The {@link addDays} function options.
 */
export interface AddDaysOptions<DateType extends Date = Date>
  extends ContextOptions<DateType> {
  /** Se `true`, os sábados e domingos serão pulados no cálculo. */
  excludeWeekends?: boolean;
  /** Um array de datas que devem ser puladas no cálculo. */
  excludedDates?: Array<DateArg<DateType>>;
}

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 * A funcionalidade foi estendida para permitir a exclusão de finais de semana e
 * um array de datas específicas, útil para cálculos de dias úteis.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be added.
 * @param options - An object with options, including `excludeWeekends` and `excludedDates` para a nova funcionalidade.
 *
 * @returns The new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 *
 * @example
 * // Add 10 business days to 1 September 2014, excluding weekends:
 * const result = addDays(new Date(2014, 8, 1), 10, { excludeWeekends: true })
 * //=> Mon Sep 15 2014 00:00:00
 */
export function addDays(
  date: Date,
  amount: number,
  options?: {
    excludeWeekends?: boolean;
    excludedDates?: Date[];
  }
): Date {
  const originalDate = new Date(date);
  const result = new Date(date);
  const direction = amount < 0 ? -1 : 1;

  if (!options?.excludeWeekends && !options?.excludedDates?.length) {
    // Modo padrão: comportamento original da date-fns
    result.setDate(result.getDate() + amount);
    return result;
  }

  // Modo com exclusão de fins de semana e/ou datas específicas
  let daysAdded = 0;
  const excludedDatesSet = new Set(
    options?.excludedDates?.map(d => new Date(d).toDateString()) || []
  );

  while (daysAdded < Math.abs(amount)) {
    result.setDate(result.getDate() + direction);
    const day = result.getDay();
    const currentDateStr = result.toDateString();

    // Verifica se a data atual deve ser contada
    const isWeekend = options?.excludeWeekends && (day === 0 || day === 6);
    const isExcludedDate = excludedDatesSet.has(currentDateStr);

    if (!isWeekend && !isExcludedDate) {
      daysAdded++;
    }
  }

  return result;
}