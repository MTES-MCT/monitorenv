import { computeOccurenceWithinCurrentYear } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { DraftSchema, PublishedSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { v4 as uuidv4 } from 'uuid'

import { customDayjs } from '../../../../../cypress/e2e/utils/customDayjs'

export function getVigilanceAreaInitialValues(): Omit<VigilanceArea.VigilanceArea, 'id'> {
  return {
    comments: undefined,
    createdBy: undefined,
    geom: undefined,
    images: [],
    isDraft: true,
    linkedAMPs: [],
    linkedRegulatoryAreas: [],
    links: [],
    name: undefined,
    periods: [],
    seaFront: undefined,
    sources: [],
    tags: [],
    themes: [],
    validatedAt: undefined,
    visibility: VigilanceArea.Visibility.PRIVATE
  }
}

export function getVigilanceAreaPeriodInitialValues(): VigilanceArea.VigilanceAreaPeriod {
  return {
    computedEndDate: undefined,
    endDatePeriod: undefined,
    endingCondition: VigilanceArea.EndingCondition.NEVER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.NONE,
    id: uuidv4(),
    isAtAllTimes: false,
    isCritical: undefined,
    startDatePeriod: undefined
  }
}

export const isFormValid = (vigilanceArea: VigilanceArea.VigilanceArea | undefined, againstDraftSchema: boolean) => {
  const SchemaToValidate = againstDraftSchema ? DraftSchema : PublishedSchema

  return SchemaToValidate.isValidSync(vigilanceArea, { abortEarly: false })
}

export function isWithinPeriod(
  periods: VigilanceArea.VigilanceAreaPeriod[] | undefined,
  isCritical: boolean | undefined
) {
  return !!periods?.some(period => {
    const dateRanges = computeOccurenceWithinCurrentYear(period)

    return dateRanges.some(
      dateRange => dateRange.isCritical === isCritical && customDayjs.utc().isBetween(dateRange.start, dateRange.end)
    )
  })
}

export function isOutOfPeriod(periods: VigilanceArea.VigilanceAreaPeriod[] | undefined) {
  return !!periods?.every(period => {
    const dateRanges = computeOccurenceWithinCurrentYear(period)

    return dateRanges.every(dateRange => !customDayjs.utc().isBetween(dateRange.start, dateRange.end))
  })
}
