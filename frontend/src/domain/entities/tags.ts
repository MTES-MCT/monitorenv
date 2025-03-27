export type TagAPI = {
  id: number
  name: string
  subTags: SubTagAPI[]
}

export type SubTagAPI = {
  id: number
  name: string
}
