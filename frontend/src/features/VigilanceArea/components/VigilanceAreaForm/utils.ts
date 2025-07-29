import { DraftSchema, PublishedSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
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
    sources: [],
    startDatePeriod: undefined,
    tags: [],
    themes: [],
    validatedAt: undefined,
    visibility: VigilanceArea.Visibility.PRIVATE
  }
}

export const createNewVigilanceAreaSource: () => VigilanceArea.VigilanceAreaSource = () => ({
  controlUnitContacts: undefined,
  email: undefined,
  id: undefined,
  name: undefined,
  phone: undefined
})

export const isFormValid = (vigilanceArea: VigilanceArea.VigilanceArea | undefined) => {
  const SchemaToValidate = vigilanceArea?.isDraft ? PublishedSchema : DraftSchema

  return SchemaToValidate.isValidSync(vigilanceArea, { abortEarly: false })
}
