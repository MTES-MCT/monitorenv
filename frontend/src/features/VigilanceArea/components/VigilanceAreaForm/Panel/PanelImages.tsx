import { useImageConverter } from '@components/Form/Images/hook/useImageConverter'
import { IMAGES_WIDTH_LANDSCAPE, IMAGES_WIDTH_PORTRAIT } from '@components/Form/Images/ImageUploader'
import { ImageViewer } from '@components/Form/Images/ImageViewer'
import { Orientation, type ImageApi } from '@components/Form/types'
import { useState } from 'react'

import { PanelImageContainer, StyledImageButton } from '../style'

export function PanelImages({
  images,
  isSideWindow = false,
  vigilanceAreaName
}: {
  images: ImageApi[]
  isSideWindow?: boolean
  vigilanceAreaName: string | undefined
}) {
  const [imageViewerCurrentIndex, setImageViewerCurrentIndex] = useState<number>(-1)
  const imagesFront = useImageConverter(images)

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
