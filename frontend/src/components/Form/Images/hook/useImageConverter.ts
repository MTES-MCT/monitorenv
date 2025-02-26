import { useEffect, useState } from 'react'

import { getImagesForFront } from '../utils'

import type { ImageApi, ImageFront } from '@components/Form/types'

export const useImageConverter = (imagesApi?: ImageApi[]) => {
  const [imagesFront, setImageFront] = useState<ImageFront[]>()

  useEffect(() => {
    const fetchImages = async () => {
      const imagesForFront = await getImagesForFront(imagesApi ?? [])
      setImageFront(imagesForFront)
    }

    fetchImages()
  }, [imagesApi])

  return imagesFront
}
