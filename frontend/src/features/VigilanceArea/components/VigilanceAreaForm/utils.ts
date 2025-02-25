import { VigilanceArea } from '@features/VigilanceArea/types'

export function getVigilanceAreaInitialValues(): Omit<VigilanceArea.VigilanceArea, 'id'> {
  return {
    comments: undefined,
    computedEndDate: undefined,
    createdBy: undefined,
    endDatePeriod: undefined,
    endingCondition: undefined,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: undefined,
    geom: undefined,
    images: [],
    isArchived: false,
    isAtAllTimes: false,
    isDraft: true,
    linkedAMPs: [],
    linkedRegulatoryAreas: [],
    links: [],
    name: undefined,
    seaFront: undefined,
    source: undefined,
    startDatePeriod: undefined,
    themes: [],
    visibility: VigilanceArea.Visibility.PRIVATE
  }
}
