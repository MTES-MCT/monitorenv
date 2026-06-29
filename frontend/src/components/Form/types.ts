export enum Orientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait'
}

export type Thumbnail = {
  id?: string
  image: string
  name: string
  orientation: Orientation
}

export type FileApi = {
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
