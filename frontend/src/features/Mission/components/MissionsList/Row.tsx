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
import { ActionThemesCell } from '@features/Mission/components/MissionsList/Cells/ActionThemesCell'
import { ControlsCell } from '@features/Mission/components/MissionsList/Cells/ControlsCell'
import { UnitCell } from '@features/Mission/components/MissionsList/Cells/UnitCell'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'

import type { Mission } from '../../../../domain/entities/missions'

export function Row({ row }: { row: RowType<Mission> }) {
  const mission = row.original

  return (
    <>
      <TableWithSelectableRows.BodyTr key={row.id} data-cy="mission-row">
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          const cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length
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
      </TableWithSelectableRows.BodyTr>
      {row.getIsExpanded() && (
        <ExpandedRow data-id={`${row.id}-expanded`}>
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
                <ActionThemesCell envActions={mission.envActions} />
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
