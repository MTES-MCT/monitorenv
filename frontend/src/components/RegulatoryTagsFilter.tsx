import { useGetTagsQuery } from '@api/tagsAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { useMemo, type CSSProperties } from 'react'

import type { TagFromAPI, TagOption } from '../domain/entities/tags'

export function RegulatoryTagsFilter({
  error = undefined,
  isErrorMessageHidden = false,
  isLabelHidden = true,
  isRequired = false,
  isTransparent = true,
  label,
  onChange,
  popupStyle,
  style,
  value
}: {
  error?: string
  isErrorMessageHidden?: boolean
  isLabelHidden?: boolean
  isRequired?: boolean
  isTransparent?: boolean
  label?: string
  onChange: (nextTags: TagOption[] | TagFromAPI[] | undefined) => void
  popupStyle?: CSSProperties
  style?: CSSProperties
  value: TagOption[] | TagFromAPI[]
}) {
  const { data: tags } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  return (
    <CheckTreePicker
      key={`regulatory-tags-${tagsOptions.length}`}
      childrenKey="subTags"
      error={error}
      isErrorMessageHidden={isErrorMessageHidden}
      isLabelHidden={isLabelHidden}
      isRequired={isRequired}
      isTransparent={isTransparent}
      label={label ?? 'Filtre tags et sous-tags'}
      labelKey="name"
      name="regulatoryTags"
      onChange={onChange}
      options={tagsOptions}
      placeholder="Tags et sous-tags"
      popupStyle={popupStyle}
      renderedChildrenValue="Sous-tags."
      renderedValue="Tags"
      shouldShowLabels={false}
      style={style}
      value={value}
      valueKey="id"
    />
  )
}
