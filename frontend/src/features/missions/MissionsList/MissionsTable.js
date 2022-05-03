import React from 'react'
import { Table } from 'rsuite';
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setSideWindowPath } from '../../commonComponents/SideWindowRouter/SideWindowRouter.slice'
import { CellLocalizeMission } from './CellLocalizeMission';
import { CellEditMission } from './CellEditMission';

export const MissionsTable = ({data, isLoading}) => {
  const dispatch = useDispatch()
  const setMission = (id) => dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, {id})))

  return (<Table
            autoHeight
            loading={isLoading}
            data={data}
            onRowClick={data => {setMission(data.id)}}
          >
            <Table.Column width={70}>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.Cell dataKey="id" />
            </Table.Column>

            <Table.Column width={150}>
              <Table.HeaderCell>Date de début</Table.HeaderCell>
              <Table.Cell dataKey="inputStartDatetimeUtc" />
            </Table.Column>

            <Table.Column width={150}>
              <Table.HeaderCell>Date de fin</Table.HeaderCell>
              <Table.Cell dataKey="inputEndDatetimeUtc" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Unité (Administration)</Table.HeaderCell>
              <Table.Cell dataKey="inputEndDatetimeUtc" />
            </Table.Column>
            
            <Table.Column width={200}>
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

            <Table.Column width={200}>
              <Table.HeaderCell>Nb Contrôles</Table.HeaderCell>
              <Table.Cell dataKey="missionStatus" />
            </Table.Column>

            <Table.Column width={200}>
              <Table.HeaderCell>Statut</Table.HeaderCell>
              <Table.Cell dataKey="missionStatus" />
            </Table.Column>
            
            <Table.Column width={200}>
              <Table.HeaderCell> - </Table.HeaderCell>
              <CellLocalizeMission />
            </Table.Column>

            <Table.Column width={200}>
              <Table.HeaderCell>-</Table.HeaderCell>
              <CellEditMission />
            </Table.Column>
          </Table>
  )
}
