import { useGetTagsQuery } from '@api/tagsAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui__root'
import { getTagsAsOptions, parseOptionsToTags } from '@utils/getTagsAsOptions'
import { useField } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { TagFromAPI } from 'domain/entities/tags'

type ActionTagsProps = {
  actionIndex: number
}
export function ActionTags({ actionIndex }: ActionTagsProps) {
  const [currentTags, , helpers] = useField<TagFromAPI[]>(`envActions[${actionIndex}].tags`)

  const { data } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(data ?? [])), [data])

  return (
    <Wrapper data-cy="envaction-tags-element">
      <CheckTreePicker
        childrenKey="subTags"
        isLight
        label="Tags et sous-tags"
        labelKey="name"
        name={`envActions[${actionIndex}].tags`}
        onChange={option => {
          helpers.setValue(parseOptionsToTags(option) ?? [])
        }}
        options={tagsOptions}
        renderedChildrenValue="Sous-tags."
        renderedValue="Tags"
        value={getTagsAsOptions(currentTags.value)}
        valueKey="id"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  max-width: 567px;
`
