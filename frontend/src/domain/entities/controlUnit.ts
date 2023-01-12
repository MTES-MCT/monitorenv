export type ControlUnit = {
  administration: string
  id: number
  resources: ControlResource[]
  name: string
}

export type ControlResource = {
  id: number
  name: string
}