import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import {
  setFilteredVigilanceAreaPeriod,
  setVigilanceAreaSpecificPeriodFilter
} from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Select, type Option } from '@mtes-mct/monitor-ui'

import { VigilanceArea } from '../types'

export function PeriodFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()
  const vigilanceAreaPeriodOptions = Object.entries(VigilanceArea.VigilanceAreaFilterPeriodLabel).map(
    ([value, label]) => ({ label, value })
  ) as Option<VigilanceArea.VigilanceAreaFilterPeriod>[]

  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const debouncedSearchLayers = useSearchLayers()

  const handleSetFilteredVigilancePeriod = (
    nextVigilanceAreaPeriod: VigilanceArea.VigilanceAreaFilterPeriod | undefined
  ) => {
    if (!nextVigilanceAreaPeriod) {
      return
    }

    dispatch(setFilteredVigilanceAreaPeriod(nextVigilanceAreaPeriod))

    if (nextVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD) {
      dispatch(setVigilanceAreaSpecificPeriodFilter(undefined))
    }

    const nextVigilanceAreaSpecificPeriodFilter =
      nextVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD
        ? vigilanceAreaSpecificPeriodFilter
        : undefined

    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryTags: filteredRegulatoryTags,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: nextVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter: nextVigilanceAreaSpecificPeriodFilter
    })
  }

  return (
    <Select
      isCleanable={false}
      isLabelHidden
      isTransparent
      label="Période de vigilance"
      name="periodOfVigilanceArea"
      onChange={handleSetFilteredVigilancePeriod}
      options={vigilanceAreaPeriodOptions}
      placeholder="Période de vigilance"
      style={style}
      value={filteredVigilanceAreaPeriod}
    />
  )
}
