/* eslint-disable react/jsx-props-no-spreading */
import { reduceBy, map, flatten, pipe, uniq, filter, toPairs, join } from 'ramda'
import { Table } from 'rsuite'

import { ActionTypeEnum } from '../../../domain/entities/missions'

export function CellActionThemes({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const filterSurveillanceAndControlActions = filter(
    a => a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
  )

  // get unique subthemes
  const getTheme = ({ theme }) => theme
  const aggregateSubThemes = (acc, { subThemes }) => uniq(acc.concat(subThemes))
  const groupThemes = reduceBy(aggregateSubThemes, [], getTheme)

  const getActionThemes = ({ themes }) => themes
  const getGroupedThemes = pipe(filterSurveillanceAndControlActions, map(getActionThemes), flatten, groupThemes)

  const getThemeAndSubThemesString = ([theme, subThemes]) => `${theme} : ${subThemes.join(' / ')}`
  const cellContent = pipe(getGroupedThemes, toPairs, map(getThemeAndSubThemesString), join(' ; '))(rowData?.envActions)

  return (
    <Table.Cell {...props} data-cy="cell-envactions-themes" title={cellContent}>
      {cellContent}
    </Table.Cell>
  )
}
