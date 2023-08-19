import { SimpleTable } from '@mtes-mct/monitor-ui'
import { useReactTable, type SortingState, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useState } from 'react'
import styled from 'styled-components'

import { CONTROL_UNITS_TABLE_COLUMNS } from './constants'
import { useGetControlUnitsQuery } from '../../../api/controlUnit'
import { NavButton } from '../../../ui/NavButton'
import { Table } from '../../../ui/Table'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenu } from '../Menu/constants'

export function ControlUnitList() {
  const [sorting, setSorting] = useState<SortingState>([{ desc: false, id: 'name' }])

  const { data: controlUnits } = useGetControlUnitsQuery()

  const table = useReactTable({
    columns: CONTROL_UNITS_TABLE_COLUMNS,
    data: controlUnits || [],
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  const { rows } = table.getRowModel()

  return (
    <>
      <Title>Administration des unités de contrôle</Title>

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_LIST]}/new`}>
          Nouvelle unité de contrôle
        </NavButton>
      </ActionGroup>

      {!controlUnits && <p>Chargement en cours...</p>}
      {controlUnits && (
        <>
          {!controlUnits.length && <p>Aucune unité de contrôle.</p>}

          {controlUnits.length > 0 && (
            <SimpleTable.Table>
              <SimpleTable.Head>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <Table.Th header={header} />
                    ))}
                  </tr>
                ))}
              </SimpleTable.Head>

              <tbody>
                {rows.map(row => (
                  <SimpleTable.BodyTr>
                    {row.getVisibleCells().map(cell => (
                      <Table.Td cell={cell} />
                    ))}
                  </SimpleTable.BodyTr>
                ))}
              </tbody>
            </SimpleTable.Table>
          )}
        </>
      )}
    </>
  )
}

const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`
