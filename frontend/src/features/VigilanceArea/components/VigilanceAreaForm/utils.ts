import { computeOccurenceWithinCurrentYear } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { DraftSchema, PublishedSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
import { VigilanceArea } from '@features/VigilanceArea/types'

import { customDayjs } from '../../../../../cypress/e2e/utils/customDayjs'

export function getVigilanceAreaInitialValues(): Omit<VigilanceArea.VigilanceArea, 'id'> {
  return {
    comments: undefined,
    createdBy: undefined,
    geom: undefined,
    images: [],
    isArchived: false,
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

export function getVigilanceAreaPeriodInitialValues(): Omit<VigilanceArea.VigilanceAreaPeriod, 'id'> {
  return {
    computedEndDate: undefined,
    endDatePeriod: undefined,
    endingCondition: undefined,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: undefined,
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
