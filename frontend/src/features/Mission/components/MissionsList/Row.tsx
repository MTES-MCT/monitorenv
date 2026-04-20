import {
  ExpandableRowCell,
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowLabel,
  ExpandedRowList,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { createPinnedCellStyle, UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { ActionTagsCell } from '@features/Mission/components/MissionsList/Cells/ActionTagsCell'
import { ControlsCell } from '@features/Mission/components/MissionsList/Cells/ControlsCell'
import { ThemesCell } from '@features/Mission/components/MissionsList/Cells/ThemesCell'
import { UnitCell } from '@features/Mission/components/MissionsList/Cells/UnitCell'
import { getAllThemes } from '@features/Mission/utils'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import styled from 'styled-components'

import type { Mission } from '../../../../domain/entities/missions'

export function Row({ row }: { row: RowType<Mission> }) {
  const mission = row.original

  return (
    <>
      <StyledTr key={row.id} data-cy="mission-row">
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          const cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length,
            stickyLeftBorderIndex: 3
          })

          return (
            <ExpandableRowCell
              key={cell.id}
              onClick={() => row.toggleExpanded()}
              style={{
                maxWidth: cell.column.getSize(),
                minWidth: cell.column.getSize(),
                width: cell.column.getSize(),
                ...cellStyle
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ExpandableRowCell>
          )
        })}
      </StyledTr>
      {row.getIsExpanded() && (
        <ExpandedRow data-cy="mission-row-expanded">
          <ExpandedRowCell colSpan={5}>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>CACEM: Observations</ExpandedRowLabel>
                <ExpandedRowValue>{mission.observationsCacem ? mission.observationsCacem : UNKNOWN}</ExpandedRowValue>
              </li>
              <li>
                <ExpandedRowLabel>CNSP: Observations</ExpandedRowLabel>
                <ExpandedRowValue>{mission.observationsCnsp ? mission.observationsCnsp : UNKNOWN}</ExpandedRowValue>
              </li>
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <UnitCell controlUnits={mission.controlUnits} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>Thématiques et sous-thématiques</ExpandedRowLabel>
                <ul>
                  <ThemesCell asDetails themes={getAllThemes(mission.envActions)} />
                </ul>
              </li>
              <li>
                <ExpandedRowLabel>Tags et sous-tags</ExpandedRowLabel>
                <ActionTagsCell envActions={mission.envActions} />
              </li>
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowLabel>Contrôles</ExpandedRowLabel>
            <ControlsCell envActions={mission.envActions} />
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={3}>
            <ExpandedRowLabel>Ouvert part</ExpandedRowLabel>
            <ExpandedRowValue>{mission.openBy}</ExpandedRowValue>
          </ExpandedRowCell>
        </ExpandedRow>
      )}
    </>
  )
}

const StyledTr = styled(TableWithSelectableRows.BodyTr)`
  td:nth-of-type(2),
  td:nth-of-type(3),
  td:nth-of-type(5) {
    text-overflow: unset;
  }
`
