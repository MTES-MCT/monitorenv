import type { ControlUnit } from './controlUnit'

export type LegacyControlUnit = {
  administration: string
  contact?: string
  id: number
  isArchived: boolean
  name: string
  resources: ControlUnit.ControlUnitResource[]
}

export const getControlUnitsAsText = (controlUnits: LegacyControlUnit[]) =>
  controlUnits.map(controlUnit => `${controlUnit.name} (${controlUnit.administration})`).join(' / ')
