import React from 'react'
import { Table } from 'rsuite';

import { useGetMissionsQuery } from '../../api/missionsAPI'

export const MissionsList = ({setMission}) => {
  const { data, isError, isLoading } = useGetMissionsQuery()

  return (
    <div style={{flex:1}} >
      {isError ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <div style={{width: "100%"}}>
          <h3>Missions</h3>
          <Table
            height={400}
            data={data}
            onRowClick={data => {setMission(data.id)}}
          >
            <Table.Column width={70} align="center" fixed>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.Cell dataKey="id" />
            </Table.Column>

            <Table.Column width={200} fixed>
              <Table.HeaderCell>typeMission</Table.HeaderCell>
              <Table.Cell dataKey="typeMission" />
            </Table.Column>

            <Table.Column width={200}>
              <Table.HeaderCell>Statut</Table.HeaderCell>
              <Table.Cell dataKey="statusMission" />
            </Table.Column>

            <Table.Column width={200}>
              <Table.HeaderCell>Facade</Table.HeaderCell>
              <Table.Cell dataKey="facade" />
            </Table.Column>

            <Table.Column width={200}>
              <Table.HeaderCell>theme</Table.HeaderCell>
              <Table.Cell dataKey="theme" />
            </Table.Column>
            <Table.Column width={200}>
              <Table.HeaderCell>Début</Table.HeaderCell>
              <Table.Cell dataKey="inputStartDatetimeUtc" />
            </Table.Column>
            <Table.Column width={200}>
              <Table.HeaderCell>Fin</Table.HeaderCell>
              <Table.Cell dataKey="inputEndDatetimeUtc" />
            </Table.Column>
          </Table>
          
        </div>
      ) : null}
    </div>
  )
}