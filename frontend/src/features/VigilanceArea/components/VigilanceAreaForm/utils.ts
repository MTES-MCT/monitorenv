import { DraftSchema, PublishedSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
import { VigilanceArea } from '@features/VigilanceArea/types'

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

export const isFormValid = (vigilanceArea: VigilanceArea.VigilanceArea | undefined, againstDraftSchema: boolean) => {
  const SchemaToValidate = againstDraftSchema ? DraftSchema : PublishedSchema

  return SchemaToValidate.isValidSync(vigilanceArea, { abortEarly: false })
}
