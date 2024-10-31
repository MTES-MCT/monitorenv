import { TableWithSelectableRowsHeader } from '@components/Table/TableWithSelectableRows/Header'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { useTable } from '@hooks/useTable'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type RowSelectionState, type SortingState } from '@tanstack/react-table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import styled, { css } from 'styled-components'

import { Columns } from './Columns'
import { GroupActions } from './GroupActions'

import type { Reporting } from 'domain/entities/reporting'

export function ReportingsTable({
  isLoading,
  reportings
}: {
  isLoading: boolean
  reportings: (Reporting | undefined)[]
}) {
  const { pathname } = useLocation()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -35 : 0

  const openReportings = useAppSelector(state => state.reporting.reportings)
  const { themes } = useGetControlPlans()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'createdAt' }])

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : reportings), [isLoading, reportings])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(themes, legacyFirefoxOffset).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(themes, legacyFirefoxOffset),
    [isLoading, legacyFirefoxOffset, themes]
  )

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
  const rowVirtualizer = useTableVirtualizer({ estimateSize: 48, ref: tableContainerRef, rows })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? Math.max(0, virtualRows[0]?.start ?? 0) : 0

  const selectedIds = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => Number(original.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, rowSelection]
  )

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
      <StyledReportingsContainer ref={tableContainerRef}>
        <StyledTable $isSideWindowOpenInTab={pathname === paths.sidewindow} $withRowCheckbox>
          <TableWithSelectableRows.Head>
            {table.getHeaderGroups().map(headerGroup => (
              <TableWithSelectableRowsHeader key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </TableWithSelectableRows.Head>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td aria-label="empty-line-for-scroll" style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index]

              return (
                <TableWithSelectableRows.BodyTr
                  key={virtualRow.key}
                  $isHighlighted={!!Object.keys(openReportings).find(key => Number(key) === Number(row?.original.id))}
                  data-cy="reporting-row"
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

            <tr>
              <td aria-label="empty-line-for-scroll" style={{ height: '50px' }} />
            </tr>
          </tbody>
        </StyledTable>
      </StyledReportingsContainer>
    </>
  )
}

const StyledReportingsContainer = styled.div`
  overflow: auto;
  width: fit-content;
  // scroll width (~15px) + 4px
  padding-right: 19px;
`

/*
Hack to fix the strange checkbox vertical position inconsistency
between the side window access via /side_window and the one opened as a new window.
The position is correct when accessed via /side_window (and not when opened as a new window).
*/
const StyledTable = styled(TableWithSelectableRows.Table)<{ $isSideWindowOpenInTab: boolean }>`
  ${p =>
    !p.$isSideWindowOpenInTab &&
    css`
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
            padding-left: 14px;
            > .rs-checkbox {
              > .rs-checkbox-checker {
                > label {
                  .rs-checkbox-wrapper {
                    top: -8px;
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
                    top: -8px;
                  }
                }
              }
            }
          }
        }
      }
    `}
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
