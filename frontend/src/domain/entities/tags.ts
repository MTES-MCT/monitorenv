export type TagFromAPI = {
  id: number
  name: string
  subTags: TagFromAPI[]
}

export type TagOption = {
  id: number
  name: string
  subTags?: TagOption[]
}
