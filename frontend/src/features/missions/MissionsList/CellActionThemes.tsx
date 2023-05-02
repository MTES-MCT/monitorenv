/* eslint-disable react/jsx-props-no-spreading */
import { reduceBy, map, flatten, pipe, uniq, filter, toPairs, join } from 'ramda'
import { useMemo } from 'react'

import { ActionTypeEnum, EnvAction } from '../../../domain/entities/missions'

const getAllThemesAndSubThemesAsString = envactions => {
  const filterSurveillanceAndControlActions = filter(
    a => a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
  )

  // get unique subthemes
  const getTheme = ({ theme }) => theme
  const aggregateSubThemes = (acc, { subThemes }) => uniq(acc.concat(subThemes))
  const groupThemes = reduceBy(aggregateSubThemes, [], getTheme)

  const getActionThemes = ({ themes }) => themes
  const flattenAndGroupSubThemesByThemes = pipe(
    filterSurveillanceAndControlActions,
    map(getActionThemes),
    flatten,
    groupThemes
  )

  const getThemeAndSubThemesString = ([theme, subThemes]) => `${theme} : ${subThemes.join(' / ')}`

  return pipe(flattenAndGroupSubThemesByThemes, toPairs, map(getThemeAndSubThemesString), join(' ; '))(envactions)
}

export function CellActionThemes({ envActions }: { envActions: EnvAction[] }) {
  const cellContent = useMemo(() => getAllThemesAndSubThemesAsString(envActions), [envActions])

  return <span title={cellContent}>{cellContent}</span>
}
