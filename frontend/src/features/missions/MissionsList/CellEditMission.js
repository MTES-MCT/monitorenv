import React from 'react'
import styled from 'styled-components'
import { IconButton, Table } from 'rsuite'
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setSideWindowPath } from '../../commonComponents/SideWindowRouter/SideWindowRouter.slice'

import { ReactComponent as EditIconSVG } from '../../icons/editer_12px.svg'

export const CellEditMission = ({rowData, dataKey, ...props}) => {

  const dispatch = useDispatch()
  const setMission = () => dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, {id: rowData.id})))
  return <CustomCell {...props}>
    <IconButton icon={<EditIcon className={"rs-icon"}/>} appearance='primary' size='sm' onClick={setMission}>Editer</IconButton>
  </CustomCell>
}

const CustomCell = styled(Table.Cell)`
  .rs-table-cell-content {
    padding-top: 7px;
  }
`
const EditIcon = styled(EditIconSVG)` 
    padding: 9px !important;
`