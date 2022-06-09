import React from 'react'
import { Table } from 'rsuite';

import { CellLocalizeMission } from './CellLocalizeMission';
import { CellEditMission } from './CellEditMission';
import { DateCell } from '../../commonComponents/Table/Cell/DateCell';

export const MissionsTable = ({data, isLoading}) => {
  

  return (<Table
            fillHeight
            loading={isLoading}
            data={data}
          >
            <Table.Column width={40}>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.Cell dataKey="id" />
            </Table.Column>

            <Table.Column width={130}>
              <Table.HeaderCell>Date de début</Table.HeaderCell>
              <DateCell dataKey="inputStartDatetimeUtc" />
            </Table.Column>

            <Table.Column width={130}>
              <Table.HeaderCell>Date de fin</Table.HeaderCell>
              <DateCell dataKey="inputEndDatetimeUtc" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Unité (Administration)</Table.HeaderCell>
              <Table.Cell dataKey="inputEndDatetimeUtc" />
            </Table.Column>
            
            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.Cell dataKey="missionType" />
            </Table.Column>

            <Table.Column width={100}>
              <Table.HeaderCell>Facade</Table.HeaderCell>
              <Table.Cell dataKey="facade" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Thématiques</Table.HeaderCell>
              <Table.Cell dataKey="theme" />
            </Table.Column>

            <Table.Column width={120}>
              <Table.HeaderCell>Nb Contrôles</Table.HeaderCell>
              <Table.Cell dataKey="missionStatus" />
            </Table.Column>

            <Table.Column width={120}>
              <Table.HeaderCell>Statut</Table.HeaderCell>
              <Table.Cell dataKey="missionStatus" />
            </Table.Column>
            
            <Table.Column width={40}>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              <CellLocalizeMission />
            </Table.Column>

            <Table.Column align='center' width={100}>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              <CellEditMission />
            </Table.Column>
          </Table>
  )
}
