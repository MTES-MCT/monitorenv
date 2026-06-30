import { useNewWindow } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'

import { convertImagesToThumbnails } from '../utils'

import type { FileApi, Thumbnail } from '@components/Form/types'

/**
 * Convert files to thumbnail (only images)
 *
 * @param fileApis
 * @param isSideWindow
 */
export const useFileConverter = (fileApis?: FileApi[], isSideWindow = false) => {
  const [thumbnail, setThumbnail] = useState<Thumbnail[]>()
  const { newWindowContainerRef } = useNewWindow()

  useEffect(() => {
    const fetchImages = async () => {
      setThumbnail(
        await convertImagesToThumbnails(fileApis ?? [], isSideWindow ? newWindowContainerRef.current : document.body)
      )
    }

    fetchImages()
  }, [fileApis, isSideWindow, newWindowContainerRef])

  return thumbnail
}
