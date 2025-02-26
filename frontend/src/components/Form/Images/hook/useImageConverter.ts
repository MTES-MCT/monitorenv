import { useEffect, useState } from 'react'

import { getImagesForFront } from '../utils'

import type { ImageApi, ImageFront } from '@components/Form/types'

export const useImageConverter = (imagesApi?: ImageApi[]) => {
  const [imagesFront, setImagesFront] = useState<ImageFront[]>()

  useEffect(() => {
    const fetchImages = async () => {
      const imagesForFront = await getImagesForFront(imagesApi ?? [])
      setImagesFront(imagesForFront)
    }

    fetchImages()
  }, [imagesApi])

  return imagesFront
}
