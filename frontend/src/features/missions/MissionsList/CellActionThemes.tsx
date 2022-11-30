/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash'
import { Table } from 'rsuite'

import { ActionTypeEnum, EnvActionType } from '../../../domain/entities/missions'

export function CellActionThemes({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const actionThemes = _.chain(rowData?.envActions)
    .uniqBy((v: EnvActionType) => {
      if (v.actionType === ActionTypeEnum.CONTROL) {
        return `${v.actionTheme}${v.actionSubTheme}`
      }

      return ''
    })
    .map(v => `${v.actionTheme} ${v.actionSubTheme ? ` - ${v.actionSubTheme}` : ''}`)
    .value()

  const cellContent = actionThemes.join('-')

  return (
    <Table.Cell {...props} title={cellContent}>
      {cellContent}
    </Table.Cell>
  )
}
