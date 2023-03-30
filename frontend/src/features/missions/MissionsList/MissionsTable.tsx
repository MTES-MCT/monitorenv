import React, { useCallback } from 'react'
import { Table } from 'rsuite'

import { DateCell } from '../../../ui/Table/Cell/DateCell'
import { CellActionThemes } from './CellActionThemes'
import { CellAlert } from './CellAlert'
import { CellEditMission } from './CellEditMission'
import { CellLocalizeMission } from './CellLocalizeMission'
import { CellMissionType } from './CellMissionType'
import { CellNumberOfControls } from './CellNumberOfControls'
import { CellResources } from './CellResources'
import { CellStatus } from './CellStatus'
import { sortMissionsByProperty } from './MissionsTableSort'

import type { MissionType } from '../../../domain/entities/missions'

export function MissionsTable({ isLoading, missions }: { isLoading: boolean; missions: MissionType[] | undefined }) {
  const [sortColumn, setSortColumn] = React.useState('startDateTimeUtc')
  const [sortType, setSortType] = React.useState<'desc' | 'asc'>('desc')

  const handleSortColumn = (currSortColumn, currSortType) => {
    setSortColumn(currSortColumn)
    setSortType(currSortType)
  }

  const getMissions = useCallback(() => {
    if (sortColumn && sortType) {
      return missions?.slice().sort((a, b) => sortMissionsByProperty(a, b, sortColumn, sortType))
    }

    return missions
  }, [sortColumn, sortType, missions])

  return (
    <Table
      data={getMissions()}
      fillHeight
      loading={isLoading}
      onSortColumn={handleSortColumn}
      sortColumn={sortColumn}
      sortType={sortType}
      virtualized
    >
      <Table.Column sortable width={180}>
        <Table.HeaderCell>Date de début</Table.HeaderCell>
        <DateCell dataKey="startDateTimeUtc" />
      </Table.Column>

      <Table.Column sortable width={180}>
        <Table.HeaderCell>Date de fin</Table.HeaderCell>
        <DateCell dataKey="endDateTimeUtc" />
      </Table.Column>

      <Table.Column flexGrow={1}>
        <Table.HeaderCell>Unité (Administration)</Table.HeaderCell>
        <CellResources />
      </Table.Column>

      <Table.Column width={120}>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <CellMissionType />
      </Table.Column>

      <Table.Column sortable width={100}>
        <Table.HeaderCell>Facade</Table.HeaderCell>
        <Table.Cell dataKey="facade" />
      </Table.Column>

      <Table.Column flexGrow={1}>
        <Table.HeaderCell>Thématiques</Table.HeaderCell>
        <CellActionThemes />
      </Table.Column>

      <Table.Column width={120}>
        <Table.HeaderCell>Nb Contrôles</Table.HeaderCell>
        <CellNumberOfControls />
      </Table.Column>

      <Table.Column width={120}>
        <Table.HeaderCell>Statut</Table.HeaderCell>
        <CellStatus />
      </Table.Column>

      <Table.Column width={120}>
        <Table.HeaderCell>Alerte</Table.HeaderCell>
        <CellAlert />
      </Table.Column>

      <Table.Column align="center" width={60}>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
        <CellLocalizeMission />
      </Table.Column>

      <Table.Column align="center" width={160}>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
        <CellEditMission />
      </Table.Column>
    </Table>
  )
}
