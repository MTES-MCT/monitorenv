import { useGetTagsQuery } from '@api/tagsAPI'
import { getTagsAsOptions, parseOptionsToTags } from '@features/Tags/utils/getTagsAsOptions'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { TagAPI } from 'domain/entities/tags'

type ActionTagsProps = {
  actionIndex: number
}
export function ActionTags({ actionIndex }: ActionTagsProps) {
  const [currentTags, , helpers] = useField<TagAPI[]>(`envActions[${actionIndex}].tags`)

  const { data } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(data ?? [])), [data])

  return (
    <Wrapper data-cy="envaction-tags-element">
      <CheckTreePicker
        childrenKey="subTags"
        isLight
        label="Tags"
        name={`envActions[${actionIndex}].tags`}
        onChange={option => {
          if (option) {
            helpers.setValue(parseOptionsToTags(option))
          } else {
            helpers.setValue([])
          }
        }}
        options={tagsOptions}
        renderedChildrenValue="Sous-tags."
        renderedValue="Tags"
        value={getTagsAsOptions(currentTags.value)}
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
