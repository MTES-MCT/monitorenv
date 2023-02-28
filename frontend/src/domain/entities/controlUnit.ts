import _ from 'lodash'

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

export const getControlUnitsAsText = (controlUnits: Omit<ControlUnit, 'id'>[]) =>
  controlUnits.map(
    resource =>
      `${resource.name} ${
        _.isEmpty(resource.resources) ? '' : `(${resource.resources.map(unit => unit.name).join(' ; ')})`
      }`
  )
