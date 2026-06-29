import { type FileApi, Orientation, type Thumbnail } from '../types'

import type { UploadMode } from './FileUploader'

export const IMAGES_INFORMATIONS_TEXT = '5 photos maximum. Formats autorisés: jpeg, png, webp'
export const FILES_INFORMATIONS_TEXT = '5 fichiers maximum. Formats autorisés: jpeg, png, webp, pdf'
export const DOCS_INFORMATIONS_TEXT = '5 documents maximum. Formats autorisés: PDF'
const IMAGES_INFORMATIONS_LIMIT_MAX_ERROR = "Vous avez atteint le nombre maximum d'images"
const IMAGES_INFORMATIONS_REACHED_LIMIT_ERROR = 'Vous ne pouvez charger que 5 images au total'

function isValidBase64(str: string): boolean {
  if (str.length % 4 !== 0) {
    return false
  }

  // Check the pattern only on a short section (beginning and end) to avoid performance issues with very long strings
  const head = str.slice(0, 1000)
  const tail = str.slice(-1000)
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/

  if (!base64Pattern.test(head) || !base64Pattern.test(tail)) {
    return false
  }

  return true
}
export async function convertImagesToThumbnails(files: FileApi[], ref: HTMLElement): Promise<Thumbnail[]> {
  const processedImages = await Promise.all(
    files.map(async file => {
      try {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        if (!allowedMimeTypes.includes(file.mimeType)) {
          throw new Error('Invalid MIME type')
        }
        if (!isValidBase64(file.content)) {
          throw new Error('Invalid base64 content')
        }
        const base64Image = `data:${file.mimeType};base64,${file.content}`

        const { container, img } = createInMemoryImage(ref)
        img.src = base64Image

        await img.decode()
        const { naturalHeight, naturalWidth } = img
        ref.removeChild(container)

        return {
          image: base64Image,
          name: file.name,
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

export const areFilesValid = (
  numberOfFiles: number,
  callback?: (message: string) => void,
  mode: UploadMode = 'IMAGES'
) => {
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
    switch (mode) {
      case 'IMAGES':
        callback(IMAGES_INFORMATIONS_TEXT)
        break
      case 'FILES':
        callback(FILES_INFORMATIONS_TEXT)
        break
      case 'DOCUMENTS':
        callback(DOCS_INFORMATIONS_TEXT)
        break
      default:
        break
    }
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

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1] ?? '')
    }

    reader.onerror = reject

    reader.readAsDataURL(file)
  })

export const getUploadParameters = (mode: UploadMode) => {
  switch (mode) {
    case 'IMAGES':
      return {
        acceptedFiles: 'image/png, image/jpeg, image/webp',
        message: IMAGES_INFORMATIONS_TEXT,
        title: 'Image'
      }
    case 'DOCUMENTS':
      return {
        acceptedFiles: 'application/pdf',
        message: DOCS_INFORMATIONS_TEXT,
        title: 'Document'
      }
    case 'FILES':
      return {
        acceptedFiles: 'image/png, image/jpeg, image/webp, .pdf',
        message: FILES_INFORMATIONS_TEXT,
        title: 'Fichier'
      }
    default:
      return undefined
  }
}

export function humanFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const factor = 1024

  const index = Math.floor(Math.log(bytes) / Math.log(factor))
  const value = bytes / factor ** index

  return `${value.toFixed(decimals).replace(/\.?0+$/, '')} ${units[index]}`
}
