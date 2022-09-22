import _ from 'lodash'
import React from 'react'
import { Table } from 'rsuite'

export function CellActionThemes({ dataKey, rowData, ...props }) {
  const actionThemes = _.map(
    _.uniqBy(rowData?.envActions, v => `${v.actionTheme}${v.actionSubTheme}`),
    v => `${v.actionTheme} ${v.actionSubTheme ? ` - ${v.actionSubTheme}` : ''}`
  )
  const cellContent = actionThemes.join('-')

  return (
    <Table.Cell {...props} title={cellContent}>
      {cellContent}
    </Table.Cell>
  )
}
