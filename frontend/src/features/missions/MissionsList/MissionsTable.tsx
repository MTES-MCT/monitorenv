/* eslint-disable react/no-unstable-nested-components */
import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Loader } from 'rsuite'
import styled from 'styled-components'

import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
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
  const [sorting, setSorting] = useState<SortingState>([{ desc: false, id: 'startDate' }])

  const columns = useMemo(
    () => [
      {
        accessorFn: row => row.startDateTimeUtc,
        cell: info => getDateCell(info.getValue()),
        enableSorting: true,
        header: () => 'Début',
        id: 'startDate',
        size: 180
      },
      {
        accessorFn: row => row.endDateTimeUtc,
        cell: info => getDateCell(info.getValue()),
        enableSorting: true,
        header: () => 'Fin',
        id: 'endDate',
        size: 180
      },
      {
        accessorFn: row => row.missionSource,
        cell: info => getMissionSourceCell(info.getValue()),
        enableSorting: true,
        header: () => 'Origine',
        id: 'missionSource',
        size: 90
      },
      {
        accessorFn: row => row.controlUnits,
        cell: info => getResourcesCell(info.getValue()),
        enableSorting: false,
        header: () => 'Unité (Administration)',
        id: 'unitAndAdministration',
        maxSize: 280,
        minSize: 200
      },
      {
        accessorFn: row => row.missionTypes,
        cell: info => getMissionTypeCell(info.getValue()),
        enableSorting: false,
        header: () => 'Type',
        id: 'type',
        size: 100
      },
      {
        accessorFn: row => row.facade,
        cell: info => info.getValue(),
        enableSorting: true,
        header: () => 'Facade',
        id: 'seaFront',
        size: 100
      },
      {
        accessorFn: row => row.envActions,
        cell: info => <CellActionThemes envActions={info.getValue()} />,
        enableSorting: false,
        header: () => 'Thématiques',
        id: 'themes',
        maxSize: 280,
        minSize: 100,
        size: 200
      },
      {
        accessorFn: row => row.envActions,
        cell: info => getNumberOfControlsCell(info.getValue()),
        enableSorting: false,
        header: () => 'Nbre contrôles',
        id: 'controls',
        size: 100
      },
      {
        accessorFn: row => row.isClosed,
        cell: ({ row }) => <CellStatus row={row} />,
        enableSorting: false,
        header: () => 'Statut',
        id: 'status',
        size: 120
      },
      {
        accessorFn: row => row.geom,
        cell: info => <CellLocalizeMission geom={info.getValue()} />,
        enableSorting: false,
        header: () => '',
        id: 'geom',
        size: 60
      },
      {
        accessorFn: row => row.id,
        cell: info => <CellEditMission id={info.getValue()} />,
        enableSorting: false,
        header: () => '',
        id: 'edit',
        size: 160
      }
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: missions,
    enableSortingRemoval: false,
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
                <SimpleTable.StyledTh
                  {...{
                    style: {
                      maxWidth: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      width: header.column.getSize()
                    }
                  }}
                >
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
                          asc: <StyledChevronIcon $isOpen={false} $right={false} />,
                          desc: <StyledChevronIcon $isOpen $right={false} />
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
                  <SimpleTable.StyledTd
                    {...{
                      key: cell.id,
                      style: {
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        width: cell.column.getSize()
                      }
                    }}
                  >
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
const StyledChevronIcon = styled(ChevronIcon)`
  margin-top: 0px;
  margin-right: 0px;
`
