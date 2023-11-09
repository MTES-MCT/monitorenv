import { Tag, pluralize } from '@mtes-mct/monitor-ui'
import { isEmpty } from 'lodash/fp'

import { ControlUnit } from '../../../../../domain/entities/controlUnit'
import { isNotArchived } from '../../../../../utils/isNotArchived'
import { getIconFromControlUnitResourceType } from '../../../../ControlUnit/components/ControlUnitDialog/ControlUnitResourceList/utils'

export function displayControlUnitResourcesFromControlUnit(controlUnit: ControlUnit.ControlUnit) {
  const controlUnitResourceTypeCounts = controlUnit.controlUnitResources
    .filter(isNotArchived)
    .reduce((previousControlUnitResourceTypeCounts, controlUnitResource) => {
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
    }, {} as Record<string, number>)

  return !isEmpty(controlUnitResourceTypeCounts)
    ? Object.entries(controlUnitResourceTypeCounts).map(([type, count]) => (
        <Tag key={type} Icon={getIconFromControlUnitResourceType(type as ControlUnit.ControlUnitResourceType)} isLight>
          {`${count} ${pluralize(ControlUnit.ControlUnitResourceTypeLabel[type], count)}`}
        </Tag>
      ))
    : [<Tag>Aucun moyen</Tag>]
}
