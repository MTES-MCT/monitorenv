import { useGetTagsQuery } from '@api/tagsAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { useMemo } from 'react'

import type { TagOption } from '../domain/entities/tags'

export function RegulatoryTagsFilter({
  onChange,
  style,
  value
}: {
  onChange: (nextTags: TagOption[] | undefined) => void
  style?: React.CSSProperties
  value: TagOption[]
}) {
  const { data: tags } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  return (
    <CheckTreePicker
      key={`regulatory-tags-${tagsOptions.length}`}
      childrenKey="subTags"
      isLabelHidden
      isTransparent
      label="Filtre tags et sous-tags"
      labelKey="name"
      name="regulatoryTags"
      onChange={onChange}
      options={tagsOptions}
      placeholder="Tags et sous-tags"
      renderedChildrenValue="Sous-tags."
      renderedValue="Tags"
      shouldShowLabels={false}
      style={style}
      value={value}
      valueKey="id"
    />
  )
}
