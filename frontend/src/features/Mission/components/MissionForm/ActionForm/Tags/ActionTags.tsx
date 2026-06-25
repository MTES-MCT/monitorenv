import { useGetTagsQuery } from '@api/tagsAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getTagsAsOptions, parseOptionsToTags } from '@utils/getTagsAsOptions'
import { useField, useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { EnvActionControl, EnvActionSurveillance, Mission } from '../../../../../../domain/entities/missions'
import type { TagFromAPI } from 'domain/entities/tags'

type ActionTagsProps = {
  actionIndex: number
}
export function ActionTags({ actionIndex }: ActionTagsProps) {
  const [currentTags, , helpers] = useField<TagFromAPI[]>(`envActions[${actionIndex}].tags`)
  const {
    values: { envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionSurveillance | EnvActionControl>>()
  const startDate = envActions[actionIndex]?.actionStartDateTimeUtc ?? (startDateTimeUtc || new Date().toISOString())

  const { data } = useGetTagsQuery([startDate, startDate])

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
  max-width: 100%;
`
