export type TagFromAPI = {
  endedAt?: string
  id: number
  name: string
  startedAt?: string
  subTags: TagFromAPI[]
}

export type TagToAPI = {
  endedAt: string | undefined
  id: number | undefined
  name: string | undefined
  startedAt: string | undefined
  subTags: TagToAPI[] | undefined
}

export type TagOption = {
  id: number
  name: string
  subTags?: TagOption[]
}
