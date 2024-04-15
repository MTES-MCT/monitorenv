import { getUtcDateInMultipleFormats } from './getUtcDateInMultipleFormats'

// daysjs want a `ManipoulateType`for unitLabel but has no exported it, so we have to use `any`
export function getMissionEndDateWithTime(unitToAdd: number, unitLabel: any) {
  const endDateInString = getUtcDateInMultipleFormats().utcDateAsDayjs.add(unitToAdd, unitLabel).toISOString()

  return getUtcDateInMultipleFormats(endDateInString).utcDateTupleWithTime
}
