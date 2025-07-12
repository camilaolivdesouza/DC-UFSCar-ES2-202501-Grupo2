import { addBusinessDays } from "../addBusinessDays/index.js";
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
 */
export function addDays<
  DateType extends Date,
  ResultDate extends Date = DateType,
>(
  date: DateArg<DateType>,
  amount: number,
  options?: AddDaysOptions<ResultDate> | undefined,
): ResultDate {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);

  // If 0 days, no-op to avoid changing times in the hour before end of DST
  if (!amount) return _date;

  let extraAmounts = 0;

if (options?.excludedDates && options?.excludedDates.length > 0) {
  const excludedDates = options.excludedDates.map(d => toDate(d, options?.in));
  let tempDate = toDate(date, options?.in);
  for (let i = 0; i < Math.abs(amount); i++) {
    tempDate.setDate(tempDate.getDate() + (amount > 0 ? 1 : -1));
    if (excludedDates.some(excludedDate => excludedDate.getTime() === tempDate.getTime())) 
      extraAmounts++;
  }
}

if(options?.excludeWeekends) 
    return addBusinessDays(_date, (amount + extraAmounts));
  else
    _date.setDate(_date.getDate() + (amount + extraAmounts));
  
  return _date;
}
