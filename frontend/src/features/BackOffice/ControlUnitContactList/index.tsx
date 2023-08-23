import { SimpleTable } from '@mtes-mct/monitor-ui'
import { useReactTable, type SortingState, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useState } from 'react'
import styled from 'styled-components'

import { CONTROL_UNIT_CONTACT_TABLE_COLUMNS } from './constants'
import { useGetControlUnitContactsQuery } from '../../../api/controlUnitContact'
import { NavButton } from '../../../ui/NavButton'
import { Table } from '../../../ui/Table'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenu } from '../Menu/constants'

export function ControlUnitContactList() {
  const [sorting, setSorting] = useState<SortingState>([{ desc: false, id: 'name' }])

  const { data: controlUnitContacts } = useGetControlUnitContactsQuery()

  const table = useReactTable({
    columns: CONTROL_UNIT_CONTACT_TABLE_COLUMNS,
    data: controlUnitContacts || [],
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
      <Title>Administration des contacts</Title>

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}/new`}>
          Nouveau Contact
        </NavButton>
      </ActionGroup>

      {!controlUnitContacts && <p>Chargement en cours...</p>}
      {controlUnitContacts && (
        <>
          {!controlUnitContacts.length && <p>Aucun contact.</p>}

          {controlUnitContacts.length > 0 && (
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
