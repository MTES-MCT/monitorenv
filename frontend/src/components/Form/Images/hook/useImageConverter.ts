import { useNewWindow } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'

import { convertImagesForFront } from '../utils'

import type { ImageApi, ImageFront } from '@components/Form/types'

export const useImageConverter = (imagesApi?: ImageApi[], isSideWindow = false) => {
  const [imagesFront, setImagesFront] = useState<ImageFront[]>()
  const { newWindowContainerRef } = useNewWindow()

  useEffect(() => {
    const fetchImages = async () => {
      const imagesForFront = await convertImagesForFront(
        imagesApi ?? [],
        isSideWindow ? newWindowContainerRef.current : document.body
      )
      setImagesFront(imagesForFront)
    }

    fetchImages()
  }, [imagesApi, isSideWindow, newWindowContainerRef])

  return imagesFront
}
