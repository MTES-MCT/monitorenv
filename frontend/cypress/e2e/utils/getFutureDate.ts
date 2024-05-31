import { getUtcDateInMultipleFormats } from './getUtcDateInMultipleFormats'

// daysjs want a `ManipulateType`for unitLabel but has no exported it, so we have to use `any`
export function getFutureDate(unitToAdd: number, unitLabel: any) {
  const endDateInString = getUtcDateInMultipleFormats().asDayjsUtcDate.add(unitToAdd, unitLabel).toISOString()

  return getUtcDateInMultipleFormats(endDateInString).asDatePickerDateTime
}
