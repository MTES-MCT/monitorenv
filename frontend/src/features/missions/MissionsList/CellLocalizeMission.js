import React from 'react'
import { IconButton, Table } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as LocalizeIconSVG } from '../../icons/Oeil_apercu_carte.svg'

export const CellLocalizeMission = ({rowData, dataKey, ...props}) => {
  return <CustomCell {...props}>
    <IconButton size='sm' icon={<LocalizeIcon className="rs-icon"/>} />
  </CustomCell>
}

const LocalizeIcon = styled(LocalizeIconSVG)`
  width: 20px;
`
const CustomCell = styled(Table.Cell)`
  .rs-table-cell-content {
    padding-top: 7px;
  }
`