import React from 'react'
import _ from 'lodash'
import { Table } from 'rsuite'
import { useGetControlTopicsQuery } from '../../../api/controlTopicsAPI'

export const CellActionThemes = ({rowData, dataKey, ...props}) => {

  const actionThemes = _.map(_.uniqBy(rowData?.actions, 'actionTheme'), action => action.actionTheme)

  const { controlTopics } = useGetControlTopicsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      controlTopics: _.filter(data, r => _.includes(actionThemes, r.id?.toString())),
    }),
  })
  const cellContent = _.map(controlTopics, t => `${t.topic_level_1} / ${t.topic_level_2}`)?.join(' - ')
  return <Table.Cell {...props} title={cellContent}>
    {cellContent}
  </Table.Cell>
}
