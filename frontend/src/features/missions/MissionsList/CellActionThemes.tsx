/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash'
import { Table } from 'rsuite'

import { ActionTypeEnum, EnvActionType } from '../../../domain/entities/missions'

export function CellActionThemes({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const actionThemes = _.chain(rowData?.envActions)
    .uniqBy((v: EnvActionType) => {
      if (v.actionType === ActionTypeEnum.CONTROL && v.themes?.length > 0) {
        return `${v.themes[0]?.theme}${v.themes[0]?.subThemes}`
      }

      return ''
    })
    .map((v: EnvActionType) => {
      if (v.actionType === ActionTypeEnum.CONTROL && v.themes?.length > 0) {
        return `${v.themes[0]?.theme}${v.themes[0]?.subThemes}`
      }

      return ''
    })
    .value()

  const cellContent = actionThemes.join('-')

  return (
    <Table.Cell {...props} title={cellContent}>
      {cellContent}
    </Table.Cell>
  )
}
