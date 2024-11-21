import { type ControlUnit } from '@mtes-mct/monitor-ui'

export type LegacyControlUnit = {
  administration: string
  contact?: string | undefined
  id: number
  isArchived: boolean
  name: string
  resources: ControlUnit.ControlUnitResource[]
}

export type LegacyControlUnitForm = {
  administration: string
  contact?: string | undefined
  id: number
  isArchived: boolean
  name: string
  resources: Partial<ControlUnit.ControlUnitResource>[]
}

export const getControlUnitsAsText = (controlUnits: LegacyControlUnit[]) =>
  controlUnits.map(controlUnit => `${controlUnit.name} (${controlUnit.administration})`).join(' / ')
