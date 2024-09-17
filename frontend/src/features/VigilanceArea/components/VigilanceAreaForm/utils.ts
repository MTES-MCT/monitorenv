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
    isDraft: true,
    linkedAMPs: [],
    linkedRegulatoryAreas: [],
    links: [],
    name: undefined,
    source: undefined,
    startDatePeriod: undefined,
    themes: [],
    visibility: undefined
  }
}

export async function getImages(images: VigilanceArea.ImagePropsForApi[]) {
  const processedImages = await Promise.all(
    images.map(async image => {
      try {
        const base64Image = `data:${image.mimeType};base64,${image.content}`
        const img = new Image()
        img.src = base64Image

        await img.decode()
        const { naturalHeight, naturalWidth } = img

        return {
          image: base64Image,
          orientation:
            naturalWidth > naturalHeight ? VigilanceArea.Orientation.LANDSCAPE : VigilanceArea.Orientation.PORTRAIT
        }
      } catch (error) {
        return undefined
      }
    })
  )

  return processedImages.filter(image => image !== undefined) as VigilanceArea.ImageForFrontProps[]
}
