import { useGetTagsQuery } from '@api/tagsAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { useMemo } from 'react'

import type { TagFromAPI, TagOption } from '../domain/entities/tags'

export function RegulatoryTagsFilter({
  isLabelHidden = true,
  isRequired = false,
  isTransparent = true,
  label,
  onChange,
  style,
  value
}: {
  isLabelHidden?: boolean
  isRequired?: boolean
  isTransparent?: boolean
  label?: string
  onChange: (nextTags: TagOption[] | TagFromAPI[] | undefined) => void
  style?: React.CSSProperties
  value: TagOption[] | TagFromAPI[]
}) {
  const { data: tags } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  return (
    <CheckTreePicker
      key={`regulatory-tags-${tagsOptions.length}`}
      childrenKey="subTags"
      isLabelHidden={isLabelHidden}
      isRequired={isRequired}
      isTransparent={isTransparent}
      label={label ?? 'Filtre tags et sous-tags'}
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
