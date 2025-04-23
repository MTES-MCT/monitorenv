import { useGetThemesQuery } from '@api/themesAPI'
import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { setFilteredRegulatoryThemes } from '@features/layersSelector/search/slice'
import { getThemesAsOptions, parseOptionsToThemes } from '@features/Themes/utils/getThemesAsOptions'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckTreePicker, type CheckTreePickerOption } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

export function RegulatoryThemesFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()

  const { data: themes } = useGetThemesQuery()

  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(themes ?? [])), [themes])

  // const regulatoryTagsCustomSearch = useMemo(() => new CustomSearch(tagsOptions, ['label']), [tagsOptions])

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const debouncedSearchLayers = useSearchLayers()

  const handleSetFilteredRegulatoryThemes = (options: CheckTreePickerOption[] | undefined) => {
    const nextThemes = options ? parseOptionsToThemes(options) : []

    dispatch(setFilteredRegulatoryThemes(nextThemes))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryTags: filteredRegulatoryTags,
      regulatoryThemes: nextThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  return (
    <CheckTreePicker
      childrenKey="subThemes"
      isLabelHidden
      isTransparent
      label="Filtre thématiques et sous-thématiques"
      name="regulatoryThemes"
      onChange={handleSetFilteredRegulatoryThemes}
      options={themesOptions}
      placeholder="Thématiques et sous-thématiques"
      renderedChildrenValue="Sous-thém."
      renderedValue="Thématiques"
      style={style}
      value={getThemesAsOptions(filteredRegulatoryThemes)}
      // customSearch={regulatoryTagsCustomSearch}
    />
  )
}
