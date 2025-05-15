import { displaySubTags } from '@utils/getTagsAsOptions'
import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionControl,
  type EnvActionSurveillance
} from 'domain/entities/missions'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { TagFromAPI } from 'domain/entities/tags'

const getTagsCell = (envActions: EnvAction[]) => {
  const groupedTags = envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .reduce<{ [key: number]: TagFromAPI }>((acc, envAction) => {
      envAction.tags?.forEach(tag => {
        if (!acc[tag.id]) {
          acc[tag.id] = { ...tag, subTags: [] }
        }
        acc[tag.id]?.subTags.push(...tag.subTags)
      })

      return acc
    }, {})

  const toTagCell = (tag: TagFromAPI) => ({
    component: (
      <>
        {tag.name} <SubTagsContainer>({displaySubTags([tag])})</SubTagsContainer>
      </>
    ),
    title: `${tag.name} (${displaySubTags(tag.subTags)})`
  })

  return Object.values(groupedTags).flatMap(tag => toTagCell(tag))
}

export function CellActionTags({ envActions }: { envActions: EnvAction[] }) {
  const cellContent = useMemo(() => getTagsCell(envActions), [envActions])
  const cellTitle = useMemo(() => cellContent.map(content => content.title).join(' - '), [cellContent])

  return cellContent?.length > 0
    ? cellContent.map(({ component, title }, index) => (
        <TagsAndSubTagsContainer key={title} data-cy="cell-envActions-tags" title={cellTitle}>
          {component}
          {index < cellContent.length - 1 ? ' - ' : ''}
        </TagsAndSubTagsContainer>
      ))
    : null
}

const TagsAndSubTagsContainer = styled.span`
  color: ${p => p.theme.color.charcoal};
  font-weight: 500;
`
const SubTagsContainer = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 400;
`
