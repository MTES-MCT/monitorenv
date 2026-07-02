import { type FileApi, ImageViewer, useFileConverter } from '@mtes-mct/monitor-ui'
import { useState } from 'react'

import { Orientation } from '../../../../../types'
import { PanelImageContainer, StyledImageButton } from '../style'

const IMAGES_WIDTH_LANDSCAPE = '122px'
const IMAGES_WIDTH_PORTRAIT = '57px'

export function PanelImages({
  images,
  isSideWindow = false,
  vigilanceAreaName
}: {
  images: FileApi[]
  isSideWindow?: boolean
  vigilanceAreaName: string | undefined
}) {
  const [imageViewerCurrentIndex, setImageViewerCurrentIndex] = useState<number>(-1)
  const imagesFront = useFileConverter(images, isSideWindow)

  const openImageViewer = (currentIndex: number) => {
    setImageViewerCurrentIndex(currentIndex)
  }

  return (
    <>
      <PanelImageContainer>
        {imagesFront?.map((image, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledImageButton key={index} onClick={() => openImageViewer(index)} type="button">
            <img
              alt={`${vigilanceAreaName}-${image.name}`}
              height="82px"
              src={image?.image}
              width={image?.orientation === Orientation.LANDSCAPE ? IMAGES_WIDTH_LANDSCAPE : IMAGES_WIDTH_PORTRAIT}
            />
          </StyledImageButton>
        ))}
      </PanelImageContainer>
      {imageViewerCurrentIndex >= 0 && (
        <ImageViewer
          currentIndex={imageViewerCurrentIndex}
          images={imagesFront ?? []}
          isSideWindow={isSideWindow}
          onClose={() => setImageViewerCurrentIndex(-1)}
        />
      )}
    </>
  )
}
