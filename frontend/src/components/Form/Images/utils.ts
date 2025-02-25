import { Orientation, type ImageApiProps, type ImageFrontProps } from '../types'

export async function getImagesForFront(images: ImageApiProps[]): Promise<ImageFrontProps[]> {
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
          name: image.name,
          orientation: naturalWidth > naturalHeight ? Orientation.LANDSCAPE : Orientation.PORTRAIT
        }
      } catch (error) {
        return undefined
      }
    })
  )

  return processedImages.filter(image => image !== undefined)
}
export const compressImage = (img: HTMLImageElement, type: string, quality = 0.3) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const { width } = img
  const { height } = img

  canvas.width = width
  canvas.height = height
  ctx?.drawImage(img, 0, 0, width, height)

  return canvas.toDataURL(type, quality)
}
