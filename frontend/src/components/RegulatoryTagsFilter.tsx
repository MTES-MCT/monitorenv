import { useGetTagsQuery } from '@api/tagsAPI'
import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { setFilteredRegulatoryTags } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckTreePicker } from '@mtes-mct/monitor-ui__root'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { useMemo } from 'react'

import type { TagOption } from '../domain/entities/tags'

export function RegulatoryTagsFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()

  const { data: tags } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

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

  const handleSetFilteredRegulatoryTags = (nextTags: TagOption[] | undefined = []) => {
    dispatch(setFilteredRegulatoryTags(nextTags))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryTags: nextTags,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  return (
    <CheckTreePicker
      childrenKey="subTags"
      isLabelHidden
      isTransparent
      label="Filtre tags et sous-tags"
      labelKey="name"
      name="regulatoryTags"
      onChange={handleSetFilteredRegulatoryTags}
      options={tagsOptions}
      placeholder="Tags et sous-tags"
      renderedChildrenValue="Sous-tags."
      renderedValue="Tags"
      shouldShowLabels={false}
      style={style}
      value={filteredRegulatoryTags}
      valueKey="id"
      // customSearch={regulatoryTagsCustomSearch}
    />
  )
}
