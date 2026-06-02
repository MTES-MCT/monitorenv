export type MissionTagFromAPI = {
  id: number
  isArchived: boolean
  name: string
}

export type MissionTagToAPI = {
  id: number | undefined
  isArchived: boolean
  name: string
}

export type MissionTagTable = {
  id: number | undefined
  isArchived: boolean
  name: string | undefined
  rowId: string
}
