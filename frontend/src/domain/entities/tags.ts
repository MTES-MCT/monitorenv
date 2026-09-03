export type TagFromAPI = {
  codeFao?: string
  endedAt?: string
  id: number
  name: string
  startedAt?: string
  subTags: TagFromAPI[]
}

export type TagToAPI = {
  codeFao?: string
  endedAt?: string
  id?: number
  name?: string
  parentId?: number
  startedAt?: string
}

export type TagTable = {
  codeFao?: string
  endedAt?: string
  id?: number
  name?: string
  parentId?: number
  rowId: string
  startedAt?: string
  subRows?: TagTable[]
  subTags: TagTable[]
}

export type TagOption = {
  id: number
  name: string
  subTags?: TagOption[]
}
