import React from 'react'
import styled from 'styled-components'
import { IconButton, Table } from 'rsuite'
import { useDispatch } from 'react-redux'

import { ReactComponent as EditIconSVG } from '../../../uiMonitor/icons/editer_12px.svg'
import { editMission } from '../../../domain/use_cases/missions/editMission'

export const CellEditMission = ({rowData, dataKey, ...props}) => {

  const dispatch = useDispatch()
  const setMission = () => dispatch(editMission(rowData.id))
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