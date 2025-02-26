export enum Orientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait'
}

export type ImageFront = {
  id?: string
  image: string
  name: string
  orientation: Orientation
}

export type ImageApi = {
  content: string
  id?: string
  mimeType: string
  name: string
  size: number
}

export type Link = {
  linkText?: string
  linkUrl?: string
}
