import { useGetThemesQuery } from '@api/themesAPI'
import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { setFilteredRegulatoryThemes } from '@features/layersSelector/search/slice'
import { OptionValue } from '@features/Reportings/Filters/style'
import { getThemesAsOptions } from '@features/Themes/useCases/getThemesAsOptions'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, CustomSearch } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

export function RegulatoryThemesFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()

  const { data: themes } = useGetThemesQuery()

  const themesOptions = getThemesAsOptions(Object.values(themes ?? []))

  const regulatoryThemesCustomSearch = useMemo(() => new CustomSearch(themesOptions, ['label']), [themesOptions])

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const debouncedSearchLayers = useSearchLayers()

  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    dispatch(setFilteredRegulatoryThemes(filteredThemes))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  return (
    <CheckPicker
      key={String(themesOptions.length)}
      customSearch={regulatoryThemesCustomSearch}
      isLabelHidden
      isTransparent
      label="Thématique réglementaire"
      name="regulatoryThemes"
      onChange={handleSetFilteredRegulatoryThemes}
      options={themesOptions}
      placeholder="Thématique réglementaire"
      renderValue={() =>
        filteredRegulatoryThemes && (
          <OptionValue>{`Thématique réglementaire (${filteredRegulatoryThemes.length})`}</OptionValue>
        )
      }
      style={style}
      value={filteredRegulatoryThemes}
    />
  )
}
