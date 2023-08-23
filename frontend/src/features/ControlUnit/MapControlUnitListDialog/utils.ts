import { pluralize } from '@mtes-mct/monitor-ui'
import { isEmpty, uniq } from 'lodash/fp'

import { ControlUnit } from '../../../domain/entities/controlUnit/types'

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

export function displayPortNamesFromControlUnit(controlUnit: ControlUnit.ControlUnit): string {
  // TODO Make that non-nullable once all resources will have been attached to a base.
  const portNames = controlUnit.controlUnitResources.map(({ port }) => port?.name).filter(isDefined)

  return portNames.length > 0 ? uniq(portNames).sort().join(', ') : 'Aucun port'
}

function isDefined<T>(value?: T | null | undefined): value is T {
  return value !== undefined && value !== null
}
