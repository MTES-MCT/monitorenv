import {
  getPaddingValuesForVirtualizeTable,
  PaddingForVirtualizeTable
} from '@components/Table/PaddingForVirtualizeTable'
import { TableContainer } from '@components/Table/style'
import { TableWithSelectableRowsHeader } from '@components/Table/TableWithSelectableRows/Header'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { useAppSelector } from '@hooks/useAppSelector'
import { useTable } from '@hooks/useTable'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type RowSelectionState, type SortingState } from '@tanstack/react-table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'

import { Columns } from './Columns'
import { GroupActions } from './GroupActions'

import type { Reporting } from 'domain/entities/reporting'

export function ReportingsTable({
  isFetching,
  isLoading,
  reportings
}: {
  isFetching: boolean
  isLoading: boolean
  reportings: (Reporting | undefined)[]
}) {
  const { pathname } = useLocation()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -35 : 0

  const openReportings = useAppSelector(state => state.reporting.reportings)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'createdAt' }])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset, false).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset, isFetching),
    [isLoading, isFetching, legacyFirefoxOffset]
  )

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : reportings), [isLoading, reportings])

  const table = useTable({
    columns,
    data: tableData,
    rowSelection,
    setRowSelection,
    setSorting,
    sorting,
    withRowSelection: true
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useTableVirtualizer({ estimateSize: 30, ref: tableContainerRef, rows })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const selectedIds = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => Number(original.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, rowSelection]
  )

  const [before, after] = getPaddingValuesForVirtualizeTable(virtualRows, rowVirtualizer)

  const resetSelection = () => {
    table.resetRowSelection(true)
  }

  return (
    <>
      <GroupActions
        archiveOrDeleteReportingsCallback={resetSelection}
        reportingsIds={selectedIds}
        totalReportings={reportings?.length || 0}
      />
      <TableContainer ref={tableContainerRef}>
        <StyledTable $isSideWindowOpenInTab={pathname === paths.sidewindow} $withRowCheckbox>
          <TableWithSelectableRows.Head>
            {table.getHeaderGroups().map(headerGroup => (
              <TableWithSelectableRowsHeader key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </TableWithSelectableRows.Head>

          <tbody>
            {before > 0 && <PaddingForVirtualizeTable columLength={columns.length} height={before} name="before" />}
            {virtualRows?.map(virtualRow => {
              const row = rows[virtualRow.index]

              return (
                <TableWithSelectableRows.BodyTr
                  key={virtualRow.key}
                  ref={rowVirtualizer.measureElement} // measure dynamic row height
                  $isHighlighted={!!Object.keys(openReportings).find(key => Number(key) === Number(row?.original.id))}
                  data-cy="reporting-row"
                  data-index={virtualRow.index} // needed for dynamic row height measurement
                >
                  {row?.getVisibleCells().map(cell => (
                    <StyledTd
                      key={cell.id}
                      $hasRightBorder={cell.column.id === 'geom'}
                      $isCenter={cell.column.id === 'geom' || cell.column.id === 'edit'}
                      $isLegacyFirefox={!!legacyFirefoxOffset}
                      style={{
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </StyledTd>
                  ))}
                </TableWithSelectableRows.BodyTr>
              )
            })}
            {after > 0 && <PaddingForVirtualizeTable columLength={columns.length} height={after} name="after" />}
          </tbody>
        </StyledTable>
      </TableContainer>
    </>
  )
}

/*
Hack to fix the strange checkbox vertical position inconsistency
between the side window access via /side_window and the one opened as a new window.
The position is correct when accessed via /side_window (and not when opened as a new window).
*/
const StyledTable = styled(TableWithSelectableRows.Table)<{ $isSideWindowOpenInTab: boolean }>`
  .rs-checkbox {
    > .rs-checkbox-checker {
      > label {
        line-height: inherit;
      }
    }
  }

  > thead {
    > tr {
      > th:first-child {
        > .rs-checkbox {
          > .rs-checkbox-checker {
            > label {
              .rs-checkbox-wrapper {
                ${p => !p.$isSideWindowOpenInTab && 'top:-8px;'}
                left: -16px;
              }
            }
          }
        }
      }
    }
  }
  > tbody {
    > tr {
      > td:first-child {
        > .rs-checkbox {
          > .rs-checkbox-checker {
            > label {
              .rs-checkbox-wrapper {
                ${p => !p.$isSideWindowOpenInTab && 'top:-8px;'}
              }
            }
          }
        }
      }
    }
  }
`

const StyledTd = styled(TableWithSelectableRows.Td)<{ $isLegacyFirefox: boolean }>`
  ${p =>
    p.$isLegacyFirefox &&
    `&:first-child {
      padding-left: 16px !important;
    }
    `}

  &:nth-child(11) {
    padding: 4px 0px 4px 16px;
  }
  &:nth-child(12) {
    padding: 4px;
  }
`
