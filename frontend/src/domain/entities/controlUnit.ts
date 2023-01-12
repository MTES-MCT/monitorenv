export type ControlUnit = {
  administration: string
  id: number
  name: string
  resources: ControlResource[]
}

export type ControlResource = {
  id: number
  name: string
}
