import {
  ControlUnit,
  CustomSearch,
  type Filter,
  isDefined,
  pluralize,
  getControlUnitResourceCategoryFromType
} from '@mtes-mct/monitor-ui'
import { isEmpty, uniq } from 'lodash/fp'

import { isNotArchived } from '../../utils/isNotArchived'

import type { FiltersState } from './components/ControlUnitListDialog/types'
import type { ControlUnitFilters } from '@features/Dashboard/components/DashboardForm/slice'
import type { Extent } from 'ol/extent'

export function addBufferToExtent(extent: Extent, bufferRatio: number) {
  const typedExtent = extent as [number, number, number, number]

  const width = typedExtent[2] - typedExtent[0]
  const height = typedExtent[3] - typedExtent[1]
  const bufferWidth = width * bufferRatio
  const bufferHeight = height * bufferRatio

  const bufferedExtent = [
    typedExtent[0] - bufferWidth,
    typedExtent[1] - bufferHeight,
    typedExtent[2] + bufferWidth,
    typedExtent[3] + bufferHeight
  ]

  return bufferedExtent
}

export function displayBaseNamesFromControlUnit(controlUnit: ControlUnit.ControlUnit): string {
  const baseNames = controlUnit.controlUnitResources.map(({ station: base }) => base.name).filter(isDefined)

  return baseNames.length > 0 ? uniq(baseNames).sort().join(', ') : 'Aucune base'
}

export function displayControlUnitResourcesFromControlUnit(controlUnit: ControlUnit.ControlUnit): string {
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
    ? Object.entries(controlUnitResourceTypeCounts)
        .map(([type, count]) => `${count} ${pluralize(ControlUnit.ControlUnitResourceTypeLabel[type], count)}`)
        .join(', ')
    : 'Aucun moyen'
}

export function getFilters(
  data: ControlUnit.ControlUnit[],
  filtersState: FiltersState | ControlUnitFilters,
  cacheKey: string
): Filter<ControlUnit.ControlUnit>[] {
  const customSearch = new CustomSearch(
    data,
    [
      { name: 'administration.name', weight: 0.1 },
      { name: 'name', weight: 0.9 },
      { name: 'controlUnitResources.name', weight: 0.9 }
    ],
    {
      cacheKey,
      isStrict: true,
      withCacheInvalidation: true
    }
  )
  const filters: Array<Filter<ControlUnit.ControlUnit>> = []

  // Search query
  // ⚠️ Order matters! Search query should be kept before other filters.
  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<ControlUnit.ControlUnit> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  // Administration
  if (filtersState.administrationId) {
    const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
      controlUnits.filter(controlUnit => controlUnit.administrationId === filtersState.administrationId)

    filters.push(filter)
  }

  // Base
  if (filtersState.stationId) {
    const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
      controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
        const matches = controlUnit.controlUnitResources.filter(
          ({ isArchived, stationId }) => !isArchived && stationId === filtersState.stationId
        )

        return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
      }, [])

    filters.push(filter)
  }

  // Control Unit Resource Category
  if ('categories' in filtersState && filtersState.categories) {
    const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
      controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
        const matches = controlUnit.controlUnitResources.filter(({ isArchived, type }) => {
          const category = getControlUnitResourceCategoryFromType(type)

          return !isArchived && !!category && filtersState.categories?.includes(category)
        })

        return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
      }, [])

    filters.push(filter)
  }

  // Control Unit Resource Type
  if (filtersState.type) {
    const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
      controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
        const matches = controlUnit.controlUnitResources.filter(
          ({ isArchived, type }) => !isArchived && type === filtersState.type
        )

        return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
      }, [])

    filters.push(filter)
  }

  return filters
}
