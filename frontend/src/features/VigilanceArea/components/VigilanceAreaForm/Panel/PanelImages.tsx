import { IMAGES_WIDTH_LANDSCAPE, IMAGES_WIDTH_PORTRAIT } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useEffect, useState } from 'react'

import { ImageViewer } from '../ImageViewer'
import { PanelImageContainer, StyledImageButton } from '../style'
import { getImages } from '../utils'

export function PanelImages({
  images,
  isSideWindow = false,
  vigilanceAreaName
}: {
  images: VigilanceArea.ImagePropsForApi[]
  isSideWindow?: boolean
  vigilanceAreaName: string | undefined
}) {
  const [imageViewerCurrentIndex, setImageViewerCurrentIndex] = useState<number>(-1)
  const [imagesList, setImagesList] = useState<VigilanceArea.ImageForFrontProps[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      const formattedImages = await getImages(images)
      setImagesList(formattedImages)
    }

    fetchImages()
  }, [images])

  const openImageViewer = (currentIndex: number) => {
    setImageViewerCurrentIndex(currentIndex)
  }

  return (
    <>
      <PanelImageContainer>
        {imagesList.map((image, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledImageButton key={index} onClick={() => openImageViewer(index)} type="button">
            <img
              alt={`${vigilanceAreaName}-${image.name}`}
              height="82px"
              src={image?.image}
              width={
                image?.orientation === VigilanceArea.Orientation.LANDSCAPE
                  ? IMAGES_WIDTH_LANDSCAPE
                  : IMAGES_WIDTH_PORTRAIT
              }
            />
          </StyledImageButton>
        ))}
      </PanelImageContainer>
      {imageViewerCurrentIndex >= 0 && (
        <ImageViewer
          currentIndex={imageViewerCurrentIndex}
          images={imagesList.map(image => image.image)}
          isSideWindow={isSideWindow}
          onClose={() => setImageViewerCurrentIndex(-1)}
        />
      )}
    </>
  )
}
