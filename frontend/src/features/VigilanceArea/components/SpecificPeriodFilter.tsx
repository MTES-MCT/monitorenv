import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { setVigilanceAreaSpecificPeriodFilter } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { DateRangePicker, type DateAsStringRange } from '@mtes-mct/monitor-ui'

export function SpecificPeriodFilter() {
  const dispatch = useAppDispatch()

  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const debouncedSearchLayers = useSearchLayers()

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(setVigilanceAreaSpecificPeriodFilter(dateRange))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryTags: filteredRegulatoryTags,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter: dateRange
    })
  }

  return (
    <DateRangePicker
      defaultValue={vigilanceAreaSpecificPeriodFilter as DateAsStringRange}
      isLabelHidden
      isStringDate
      label="Période spécifique"
      name="dateRange"
      onChange={updateDateRangeFilter}
    />
  )
}
