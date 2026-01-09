import { isOutOfPeriod, isWithinPeriod } from '@features/VigilanceArea/components/VigilanceAreaForm/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'

export function getFilterInformativeVigilanceArea(
  typeFilter: VigilanceArea.VigilanceAreaFilterType[] | undefined,
  vigilanceArea: VigilanceArea.VigilanceArea
) {
  return (
    (typeFilter?.includes(VigilanceArea.VigilanceAreaFilterType.INFORMATIVE) &&
      (vigilanceArea.periods ?? []).length === 0) === true
  )
}

export function isVigilanceAreaPartOfType(
  vigilanceArea: VigilanceArea.VigilanceArea,
  typeFilter?: VigilanceArea.VigilanceAreaFilterType[]
): boolean {
  if (!typeFilter || typeFilter.length === 0) {
    return true
  }

  const filterSimpleVigilanceArea =
    typeFilter.includes(VigilanceArea.VigilanceAreaFilterType.SIMPLE) && isWithinPeriod(vigilanceArea.periods, false)

  const filterInformativeVigilanceArea =
    typeFilter.includes(VigilanceArea.VigilanceAreaFilterType.INFORMATIVE) && isOutOfPeriod(vigilanceArea.periods)

  const filterCriticalVigilanceArea =
    typeFilter.includes(VigilanceArea.VigilanceAreaFilterType.CRITICAL) && isWithinPeriod(vigilanceArea.periods, true)

  return filterSimpleVigilanceArea || filterCriticalVigilanceArea || filterInformativeVigilanceArea
}
