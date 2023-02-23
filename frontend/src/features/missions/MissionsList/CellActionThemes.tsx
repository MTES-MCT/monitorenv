/* eslint-disable react/jsx-props-no-spreading */
import { reduceBy, map, flatten, pipe, uniq, filter, toPairs, join } from 'ramda'
import { useMemo } from 'react'
import { Table } from 'rsuite'

import { ActionTypeEnum } from '../../../domain/entities/missions'

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

export function CellActionThemes({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const cellContent = useMemo(() => getAllThemesAndSubThemesAsString(rowData?.envActions), [rowData?.envActions])

  return (
    <Table.Cell {...props} data-cy="cell-envactions-themes" title={cellContent}>
      {cellContent}
    </Table.Cell>
  )
}
