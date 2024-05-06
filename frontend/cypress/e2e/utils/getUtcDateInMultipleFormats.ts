import { customDayjs } from './customDayjs'

export function getUtcDateInMultipleFormats(date?: string) {
  const asDayjsUtcDate = customDayjs(date).utc()

  return {
    asApiDateTime: asDayjsUtcDate.toISOString().substring(0, 16),
    asDatePickerDate: [asDayjsUtcDate.year(), asDayjsUtcDate.month() + 1, asDayjsUtcDate.date()] as [
      number,
      number,
      number
    ],
    asDatePickerDateTime: [
      asDayjsUtcDate.year(),
      asDayjsUtcDate.month() + 1,
      asDayjsUtcDate.date(),
      asDayjsUtcDate.hour(),
      asDayjsUtcDate.minute()
    ] as [number, number, number, number, number],
    asDayjsUtcDate,
    /**
     * ISO string without seconds, milliseconds, and timezone offset.
     *
     * @example
     * `2023-06-08T13:54`
     */
    asEncodedStringUtcDate: encodeURIComponent(asDayjsUtcDate.toISOString()),
    asStringUtcDate: asDayjsUtcDate.toISOString()
  }
}
