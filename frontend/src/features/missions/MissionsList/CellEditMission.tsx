/* eslint-disable react/jsx-props-no-spreading */
import { useDispatch } from 'react-redux'
import { IconButton, Table } from 'rsuite'
import styled from 'styled-components'

import { editMission } from '../../../domain/use_cases/missions/editMission'
import { ReactComponent as EditIconSVG } from '../../../uiMonitor/icons/Edit.svg'

export function CellEditMission({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const dispatch = useDispatch()
  const setMission = () => dispatch(editMission(rowData.id))

  return (
    <CustomCell {...props}>
      <IconButton
        appearance="primary"
        data-cy="edit-mission"
        icon={<EditIconSVG className="rs-icon" />}
        onClick={setMission}
        size="sm"
      >
        Editer
      </IconButton>
    </CustomCell>
  )
}

const CustomCell = styled(Table.Cell)`
  .rs-table-cell-content {
    padding-top: 10px;
  }
`
