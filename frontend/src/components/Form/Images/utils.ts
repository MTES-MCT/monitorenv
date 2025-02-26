import { Orientation, type ImageApi, type ImageFront } from '../types'

export const IMAGES_INFORMATIONS_TEXT = '5 photos maximum. Formats autorisés: jpeg, png, webp'
const IMAGES_INFORMATIONS_LIMIT_MAX_ERROR = "Vous avez atteint le nombre maximum d'images"
const IMAGES_INFORMATIONS_REACHED_LIMIT_ERROR = 'Vous ne pouvez charger que 5 images au total'

export async function getImagesForFront(images: ImageApi[]): Promise<ImageFront[]> {
  const processedImages = await Promise.all(
    images.map(async image => {
      try {
        const base64Pattern = /^[a-zA-Z0-9+/]+={0,2}$/
        if (!base64Pattern.test(image.content)) {
          throw new Error('Invalid base64 content')
        }
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

export const areFilesValid = (numberOfFiles: number, callback?: (message: string) => void) => {
  if (numberOfFiles > 5) {
    if (callback) {
      callback(IMAGES_INFORMATIONS_REACHED_LIMIT_ERROR)
    }

    return false
  }
  if (numberOfFiles === 5) {
    if (callback) {
      callback(IMAGES_INFORMATIONS_LIMIT_MAX_ERROR)
    }

    return true
  }

  if (callback) {
    callback(IMAGES_INFORMATIONS_TEXT)
  }

  return true
}
