import { useGetTagsQuery } from '@api/tagsAPI'
import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { setFilteredRegulatoryTags } from '@features/layersSelector/search/slice'
import { OptionValue } from '@features/Reportings/Filters/style'
import { getTagsAsOptions } from '@features/Tags/useCases/getTagsAsOptions'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, CustomSearch } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

export function RegulatoryTagsFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()

  const { data: tags } = useGetTagsQuery()

  const tagsOptions = getTagsAsOptions(Object.values(tags ?? []))

  const regulatoryTagsCustomSearch = useMemo(() => new CustomSearch(tagsOptions, ['label']), [tagsOptions])

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const debouncedSearchLayers = useSearchLayers()

  const handleSetFilteredRegulatoryTags = (filteredTags: string[]) => {
    dispatch(setFilteredRegulatoryTags(filteredTags))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryTags: filteredTags,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  return (
    <CheckPicker
      key={String(tagsOptions.length)}
      customSearch={regulatoryTagsCustomSearch}
      isLabelHidden
      isTransparent
      label="Thématique réglementaire"
      name="regulatoryTags"
      onChange={handleSetFilteredRegulatoryTags}
      options={tagsOptions}
      placeholder="Thématique réglementaire"
      renderValue={() =>
        filteredRegulatoryTags && (
          <OptionValue>{`Thématique réglementaire (${filteredRegulatoryTags.length})`}</OptionValue>
        )
      }
      style={style}
      value={filteredRegulatoryTags}
    />
  )
}
