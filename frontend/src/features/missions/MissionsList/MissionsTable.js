import React, {useCallback} from 'react'
import { Table } from 'rsuite'

import { CellLocalizeMission } from './CellLocalizeMission'
import { CellEditMission } from './CellEditMission'
import { DateCell } from '../../../ui/Table/Cell/DateCell'
import {sortMissionsByProperty} from './MissionsTableSort'
import { CellResources } from './CellResources'
import { CellMissionType } from './CellMissionType'
import { CellActionThemes } from './CellActionThemes'
import { CellNumberOfControls } from './CellNumberOfControls'
import { CellAlert } from './CellAlert'
import { CellStatus } from './CellStatus'

export const MissionsTable = ({data, isLoading}) => {

  const [sortColumn, setSortColumn] = React.useState('inputStartDatetimeUtc')
  const [sortType, setSortType] = React.useState('desc')

  const handleSortColumn = (currSortColumn, currSortType) => {
    setSortColumn(currSortColumn)
    setSortType(currSortType)
  }

  const getMissions = useCallback(() => {
    if (sortColumn && sortType) {
      return data
        .slice()
        .sort((a, b) => sortMissionsByProperty(a, b, sortColumn, sortType))
    }

    return data
  }, [sortColumn, sortType, data])

  return (<Table
            fillHeight
            loading={isLoading}
            data={getMissions()}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn} 
          >
            <Table.Column sortable width={130}>
              <Table.HeaderCell>Date de début</Table.HeaderCell>
              <DateCell dataKey="inputStartDatetimeUtc" />
            </Table.Column>

            <Table.Column sortable width={130}>
              <Table.HeaderCell>Date de fin</Table.HeaderCell>
              <DateCell dataKey="inputEndDatetimeUtc" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Unité (Administration)</Table.HeaderCell>
              <CellResources />
            </Table.Column>
            
            <Table.Column width={100}>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <CellMissionType />
            </Table.Column>

            <Table.Column sortable width={100}>
              <Table.HeaderCell>Facade</Table.HeaderCell>
              <Table.Cell dataKey="facade" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Thématiques</Table.HeaderCell>
              <CellActionThemes/>
            </Table.Column>

            <Table.Column width={120}>
              <Table.HeaderCell>Nb Contrôles</Table.HeaderCell>
              <CellNumberOfControls/>
            </Table.Column>

            <Table.Column width={120}>
              <Table.HeaderCell>Statut</Table.HeaderCell>
              <CellStatus/>
            </Table.Column>

            <Table.Column width={120}>
              <Table.HeaderCell>Alerte</Table.HeaderCell>
              <CellAlert/>
            </Table.Column>
            
            <Table.Column align='center' width={60}>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              <CellLocalizeMission />
            </Table.Column>

            <Table.Column align='center' width={160}>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              <CellEditMission />
            </Table.Column>
          </Table>
  )
}
