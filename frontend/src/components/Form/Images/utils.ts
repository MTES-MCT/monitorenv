import { type ImageApi, type ImageFront, Orientation } from '../types'

export const IMAGES_INFORMATIONS_TEXT = '5 photos maximum. Formats autorisés: jpeg, png, webp'
const IMAGES_INFORMATIONS_LIMIT_MAX_ERROR = "Vous avez atteint le nombre maximum d'images"
const IMAGES_INFORMATIONS_REACHED_LIMIT_ERROR = 'Vous ne pouvez charger que 5 images au total'

export async function convertImagesForFront(images: ImageApi[], ref: HTMLElement): Promise<ImageFront[]> {
  const processedImages = await Promise.all(
    images.map(async image => {
      try {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedMimeTypes.includes(image.mimeType)) {
          throw new Error('Invalid MIME type')
        }
        const base64Pattern = /^[a-zA-Z0-9+/]+={0,2}$/
        if (!base64Pattern.test(image.content)) {
          throw new Error('Invalid base64 content')
        }
        const base64Image = `data:${image.mimeType};base64,${image.content}`
        const { container, img } = createInMemoryImage(ref)
        img.src = base64Image

        await img.decode()
        const { naturalHeight, naturalWidth } = img
        ref.removeChild(container)

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

/** Create a <img> attached to a <div> attached to the given ref. Resolve a Chrome bug on sidewindow that blocks `img.decode` to work
 *
 * @param ref ref of the container
 * @param file source of the image
 * @returns the image and the container that the image is attached to. Don't forget to unattached it to avoid memory leak
 */
export const createInMemoryImage = (ref: HTMLElement, file?: File) => {
  const img = document.createElement('img')
  if (file) {
    img.src = URL.createObjectURL(file)
  }
  img.style.display = 'none'

  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.width = '1px'
  container.style.height = '1px'
  container.style.overflow = 'hidden'
  container.appendChild(img)
  ref.appendChild(container)

  return { container, img }
}
