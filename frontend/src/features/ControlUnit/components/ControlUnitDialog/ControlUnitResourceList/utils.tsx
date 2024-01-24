import { ControlUnit, Icon, getControlUnitResourceCategoryFromType } from '@mtes-mct/monitor-ui'

import { ControlUnit as LocalControlUnit } from '../../../../../domain/entities/controlUnit'

export function getIconFromControlUnitResourceType(type: LocalControlUnit.ControlUnitResourceType) {
  const category = getControlUnitResourceCategoryFromType(type)

  switch (category) {
    case ControlUnit.ControlUnitResourceCategory.LAND:
      return Icon.Car

    case ControlUnit.ControlUnitResourceCategory.AIR:
      return Icon.Plane

    case ControlUnit.ControlUnitResourceCategory.SEA:
      return Icon.FleetSegment

    default:
      return undefined
  }
}
