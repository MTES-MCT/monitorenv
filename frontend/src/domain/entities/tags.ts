export type TagFromAPI = {
  id: number
  name: string
  subTags: TagFromAPI[]
}
