import { BaseRow } from '@components/Table/TableWithSelectableRows/BaseRow'
import {
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowLabel,
  ExpandedRowList,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { ActionTagsCell } from '@features/Mission/components/MissionsList/Cells/ActionTagsCell'
import { ControlsCell } from '@features/Mission/components/MissionsList/Cells/ControlsCell'
import { ThemesCell } from '@features/Mission/components/MissionsList/Cells/ThemesCell'
import { UnitCell } from '@features/Mission/components/MissionsList/Cells/UnitCell'
import { getAllThemes } from '@features/Mission/utils'
import { Tag, THEME } from '@mtes-mct/monitor-ui'
import { type Row as RowType } from '@tanstack/react-table'

import type { Mission } from '../../../../domain/entities/missions'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

export function Row({
  row,
  rowVirtualizer,
  virtualRow
}: {
  row: RowType<Mission>
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  virtualRow: VirtualItem
}) {
  const mission = row.original

  return (
    <BaseRow
      key={row.id}
      data-cy="mission-row"
      row={row}
      rowVirtualizer={rowVirtualizer}
      stickyLeftBorderIndex={3}
      virtualRow={virtualRow}
    >
      {row.getIsExpanded() && (
        <ExpandedRow data-cy="mission-row-expanded">
          <ExpandedRowCell colSpan={5}>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>CACEM: Observations</ExpandedRowLabel>
                <ExpandedRowValue>{mission.observationsCacem ?? UNKNOWN}</ExpandedRowValue>
              </li>
              <li>
                <ExpandedRowLabel>CNSP: Observations</ExpandedRowLabel>
                <ExpandedRowValue>{mission.observationsCnsp ?? UNKNOWN}</ExpandedRowValue>
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
          <ExpandedRowCell>
            <ExpandedRowLabel>Ouvert part</ExpandedRowLabel>
            <ExpandedRowValue>{mission.openBy ?? UNKNOWN}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowLabel>Étiquettes de mission</ExpandedRowLabel>
            <ul>
              {mission.isNoteworthy && (
                <Tag backgroundColor={THEME.color.charcoal} color={THEME.color.white}>
                  Opération marquante
                </Tag>
              )}
              {mission.missionTags?.map(missionTag => (
                <li key={missionTag.id}>
                  <Tag backgroundColor={THEME.color.white}>{missionTag.name}</Tag>
                </li>
              ))}
            </ul>
          </ExpandedRowCell>
        </ExpandedRow>
      )}
    </BaseRow>
  )
}
