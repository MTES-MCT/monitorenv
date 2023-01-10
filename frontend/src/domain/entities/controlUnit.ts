export type ControlUnit = {
  administration: string
  id: number
  resources: controlResource[]
  name: string
}

type controlResource = {
  id: number
  name: string
}