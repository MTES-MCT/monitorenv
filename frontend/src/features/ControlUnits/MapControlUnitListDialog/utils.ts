import { pluralize } from '@mtes-mct/monitor-ui'
import { isEmpty, uniq } from 'lodash/fp'

import { ControlUnit } from '../../../domain/entities/controlUnit'

export function displayBaseNamesFromControlUnit(controlUnit: ControlUnit.ControlUnit): string {
  // TODO Make that non-nullable once all resources will have been attached to a base.
  const baseNames = controlUnit.controlUnitResources.map(({ base }) => base?.name).filter(isDefined)

  return baseNames.length > 0 ? uniq(baseNames).sort().join(', ') : 'Aucune base'
}

export function displayControlUnitResourcesFromControlUnit(controlUnit: ControlUnit.ControlUnit): string {
  const controlUnitResourceTypeCounts = controlUnit.controlUnitResources.reduce(
    (previousControlUnitResourceTypeCounts, controlUnitResource) => {
      // TODO Make that non-nullable once all resources will have been attached to a type.
      if (!controlUnitResource.type) {
        return previousControlUnitResourceTypeCounts
      }

      const controlUnitResourceTypeCount = previousControlUnitResourceTypeCounts[controlUnitResource.type]
      if (!controlUnitResourceTypeCount) {
        return {
          ...previousControlUnitResourceTypeCounts,
          [controlUnitResource.type]: 1
        }
      }

      return {
        ...previousControlUnitResourceTypeCounts,
        [controlUnitResource.type]: controlUnitResourceTypeCount + 1
      }
    },
    {} as Record<string, number>
  )

  return !isEmpty(controlUnitResourceTypeCounts)
    ? Object.entries(controlUnitResourceTypeCounts)
        .map(([type, count]) => `${count} ${pluralize(ControlUnit.ControlUnitResourceType[type], count)}`)
        .join(', ')
    : 'Aucun moyen'
}

function isDefined<T>(value?: T | null | undefined): value is T {
  return value !== undefined && value !== null
}
