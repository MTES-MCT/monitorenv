/* eslint-disable react/no-unstable-nested-components */
import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Loader } from 'rsuite'
import styled from 'styled-components'

import { CellActionThemes } from './CellActionThemes'
import { CellEditMission } from './CellEditMission'
import { CellLocalizeMission } from './CellLocalizeMission'
import { CellStatus } from './CellStatus'
import { getDateCell } from './getDateCell'
import { getMissionSourceCell } from './getMissionSourceCell'
import { getMissionTypeCell } from './getMissionTypeCell'
import { getNumberOfControlsCell } from './getNumberOfControlsCell'
import { getResourcesCell } from './getResourcesCell'

import type { Mission } from '../../../domain/entities/missions'

export function MissionsTable({ isLoading, missions }: { isLoading: boolean; missions: Mission[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ desc: false, id: 'dateDebut' }])

  const columns = useMemo(
    () => [
      {
        accessorFn: row => row.startDateTimeUtc,
        cell: info => getDateCell(info.getValue()),
        header: () => 'Début',
        id: 'startDate'
      },
      {
        accessorFn: row => row.endDateTimeUtc,
        cell: info => getDateCell(info.getValue()),
        header: () => 'Fin',
        id: 'endDate'
      },
      {
        accessorFn: row => row.missionSource,
        cell: info => getMissionSourceCell(info.getValue()),
        header: () => 'Origine',
        id: 'missionSource'
      },
      {
        accessorFn: row => row.controlUnits,
        cell: info => getResourcesCell(info.getValue()),
        enableSorting: false,
        header: () => 'Unité (Administration)',
        id: 'unitAndAdministration'
      },
      {
        accessorFn: row => row.missionTypes,
        cell: info => getMissionTypeCell(info.getValue()),
        enableSorting: false,
        header: () => 'Type',
        id: 'type'
      },
      {
        accessorFn: row => row.facade,
        cell: info => info.getValue(),
        header: () => 'Facade',
        id: 'seaFront'
      },
      {
        accessorFn: row => row.envActions,
        cell: info => <CellActionThemes envActions={info.getValue()} />,
        enableSorting: false,
        header: () => 'Thématiques',
        id: 'themes'
      },
      {
        accessorFn: row => row.envActions,
        cell: info => getNumberOfControlsCell(info.getValue()),
        enableSorting: false,
        header: () => 'Nbre contrôles',
        id: 'controls'
      },
      {
        accessorFn: row => row.isClosed,
        cell: ({ row }) => <CellStatus row={row} />,
        enableSorting: false,
        header: () => 'Statut',
        id: 'status'
      },
      {
        accessorFn: row => row.geom,
        cell: info => <CellLocalizeMission geom={info.getValue()} />,
        enableSorting: false,
        header: () => '',
        id: 'geom'
      },
      {
        accessorFn: row => row.id,
        cell: info => <CellEditMission id={info.getValue()} />,
        enableSorting: false,
        header: () => '',
        id: 'edit'
      }
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: missions,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 40,
    getItemKey: useCallback((index: number) => `${rows[index]?.id}`, [rows]),
    getScrollElement: () => tableContainerRef.current,
    overscan: 10
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const [paddingTop, paddingBottom] =
    virtualRows.length > 0
      ? [
          Math.max(0, virtualRows[0]?.start || 0),
          Math.max(0, rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end || 0))
        ]
      : [0, 0]

  if (isLoading) {
    return <Loader center content={<span>Chargement</span>} />
  }

  return (
    <StyledMissionsContainer ref={tableContainerRef}>
      <SimpleTable.StyledTable>
        <SimpleTable.StyledHead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <SimpleTable.StyledTh key={header.id}>
                  {header.isPlaceholder ? undefined : (
                    <SimpleTable.StyledSortContainer
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        onClick: header.column.getToggleSortingHandler()
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() &&
                        ({
                          asc: <Icon.Close />,
                          desc: <Icon.Chevron />
                        }[header.column.getIsSorted() as string] ?? <Icon.SortingArrows size={14} />)}
                    </SimpleTable.StyledSortContainer>
                  )}
                </SimpleTable.StyledTh>
              ))}
            </tr>
          ))}
        </SimpleTable.StyledHead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index]

            return (
              <SimpleTable.StyledBodyTr key={virtualRow.key}>
                {row?.getVisibleCells().map(cell => (
                  <SimpleTable.StyledTd key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </SimpleTable.StyledTd>
                ))}
              </SimpleTable.StyledBodyTr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </SimpleTable.StyledTable>
    </StyledMissionsContainer>
  )
}

const StyledMissionsContainer = styled.div`
  overflow: auto;
  margon-bottom: 10px;
`
