export type ControlUnit = {
  administration: string
  contact?: string
  id: number
  isArchived: boolean
  name: string
  resources: ControlResource[]
}

export type ControlResource = {
  id: number
  name: string
}

export const getControlUnitsAsText = (controlUnits: ControlUnit[]) =>
  controlUnits.map(controlUnit => `${controlUnit.name} (${controlUnit.administration})`).join(' / ')
