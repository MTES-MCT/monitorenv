import { useGetTagsQuery } from '@api/tagsAPI'
import { setFilteredRegulatoryTags } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { useMemo } from 'react'

import type { TagOption } from '../domain/entities/tags'

export function RegulatoryTagsFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()

  const { data: tags } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)

  const handleSetFilteredRegulatoryTags = (nextTags: TagOption[] | undefined = []) => {
    dispatch(setFilteredRegulatoryTags(nextTags))
  }

  return (
    <CheckTreePicker
      key={`regulatory-tags-${tagsOptions.length}`}
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
    />
  )
}
