import { Dashboard } from '@features/Dashboard/types'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'

export function getImage(images: ExportImageType[], type: Dashboard.Layer, id: number | undefined): string | undefined {
  return images.find(image => {
    if (!image.featureId) {
      return false
    }
    const [imageType, imageId] = `${image.featureId}`.split(':')

    return imageType === Dashboard.featuresCode[type] && imageId && id === +imageId
  })?.image
}
