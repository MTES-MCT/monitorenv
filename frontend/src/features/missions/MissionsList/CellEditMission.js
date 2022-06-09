import React from 'react'
import { Table } from 'rsuite'

import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setSideWindowPath } from '../../commonComponents/SideWindowRouter/SideWindowRouter.slice'

import { EditButton } from '../../commonStyles/Buttons.style'


export const CellEditMission = ({rowData, dataKey, ...props}) => {

  const dispatch = useDispatch()
  const setMission = () => dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, {id: rowData.id})))
  return <Table.Cell {...props}>
    <EditButton  onClick={setMission}/>
  </Table.Cell>
}