import {
  ExpandableRowCell,
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowInlineItem,
  ExpandedRowLabel,
  ExpandedRowList,
  ExpandedRowValue,
  ExpandedRowValueDetail
} from '@components/Table/TableWithSelectableRows/style'
import { createPinnedCellStyle, UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { TagsDetailsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/TagsDetailsCell'
import { ThemesDetailsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/ThemesDetailsCell'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, customDayjs, TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import { formatCoordinatesAsText } from '@utils/coordinates'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { Fragment } from 'react/jsx-runtime'
import styled from 'styled-components'

import { CellTarget } from './CellTarget'
import { ReportingTargetTypeEnum, ReportingTargetTypeLabels } from '../../../../../domain/entities/targetType'
import { VehicleTypeEnum, vehicleTypeLabels } from '../../../../../domain/entities/vehicleType'

import type { Reporting } from '../../../../../domain/entities/reporting'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'
import type { Coordinate } from 'ol/coordinate'

export function Row({
  row,
  rowVirtualizer,
  virtualRow
}: {
  row: RowType<Reporting>
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  virtualRow: VirtualItem
}) {
  const dispatch = useAppDispatch()
  const reporting = row.original
  const { coordinatesFormat } = useAppSelector(state => state.map)

  return (
    <Fragment key={row.id}>
      <StyledTr
        ref={(node: HTMLTableRowElement | null) => {
          rowVirtualizer.measureElement(node)
        }}
        data-cy="reporting-row"
        data-index={virtualRow.index}
      >
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          const cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length,
            stickyLeftBorderIndex: 0
          })

          return (
            <ExpandableRowCell key={cell.id} onClick={() => row.toggleExpanded()} style={cellStyle}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ExpandableRowCell>
          )
        })}
      </StyledTr>
      {row.getIsExpanded() && (
        <ExpandedRow data-cy="reporting-row-expanded">
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowLabel>Saisi par</ExpandedRowLabel>
            <ExpandedRowValue>{reporting.openBy ?? UNKNOWN}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>Création</ExpandedRowLabel>
                <ExpandedRowValue>{getDateAsLocalizedStringVeryCompact(reporting.createdAt)}</ExpandedRowValue>
              </li>
              <li>
                <ExpandedRowLabel>Fin de validité</ExpandedRowLabel>
                <ExpandedRowValue>
                  {getDateAsLocalizedStringVeryCompact(
                    customDayjs(reporting.createdAt).utc().add(reporting.validityTime, 'hours').toISOString()
                  )}
                </ExpandedRowValue>
              </li>
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>Description du signalement</ExpandedRowLabel>
                <ExpandedRowValue>{reporting.description ?? UNKNOWN}</ExpandedRowValue>
              </li>
              <li>
                <ExpandedRowLabel>Actions effectuées</ExpandedRowLabel>
                <ExpandedRowValue>{reporting.actionTaken ?? UNKNOWN}</ExpandedRowValue>
              </li>
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>Position du signalement</ExpandedRowLabel>
                <ExpandedRowValue>
                  {formatCoordinatesAsText(reporting?.geom?.coordinates[0] as Coordinate, coordinatesFormat) ?? UNKNOWN}
                </ExpandedRowValue>
              </li>
              <li>
                <ul>
                  <ExpandedRowInlineItem>
                    <CustomExpandedRowLabel>Type de cible :</CustomExpandedRowLabel>
                    <ExpandedRowValue>{ReportingTargetTypeLabels[reporting.targetType] ?? UNKNOWN}</ExpandedRowValue>
                  </ExpandedRowInlineItem>
                  {reporting.targetType === ReportingTargetTypeEnum.VEHICLE && (
                    <ExpandedRowInlineItem>
                      <CustomExpandedRowLabel>Véhicule :</CustomExpandedRowLabel>
                      <ExpandedRowValue>
                        {reporting.vehicleType ? vehicleTypeLabels[reporting.vehicleType].label : UNKNOWN}
                      </ExpandedRowValue>
                    </ExpandedRowInlineItem>
                  )}
                </ul>
              </li>
              {reporting.targetDetails.map(target => (
                <li key={reporting.vehicleType === VehicleTypeEnum.VESSEL ? target.mmsi : target.registrationNumber}>
                  <CellTarget target={target} vehiculeType={reporting.vehicleType} />
                </li>
              ))}
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>Thématiques et sous-thématiques</ExpandedRowLabel>
                <ThemesDetailsCell themes={[reporting.theme]} />
              </li>
              <li>
                <ExpandedRowLabel>Tags et sous-tags</ExpandedRowLabel>
                <TagsDetailsCell tags={reporting.tags} />
              </li>
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowLabel>Mission effectuée</ExpandedRowLabel>
            <ExpandedRowValue>
              {reporting.attachedMission?.controlUnits.map(unit => unit.name).join(', ') ?? UNKNOWN}
              <br />
              <ExpandedRowValueDetail>
                {getDateAsLocalizedStringVeryCompact(
                  reporting.attachedMission?.startDateTimeUtc,
                  false,
                  false,
                  'DD MMM YY'
                )}
              </ExpandedRowValueDetail>
            </ExpandedRowValue>

            {reporting.attachedMission && (
              <StyledButton
                accent={Accent.SECONDARY}
                onClick={() => {
                  if (reporting.attachedMission?.id) {
                    dispatch(editMissionInLocalStore(reporting.attachedMission.id, 'sideWindow'))
                  }
                }}
              >
                Voir la mission
              </StyledButton>
            )}
          </ExpandedRowCell>
        </ExpandedRow>
      )}
    </Fragment>
  )
}

const StyledTr = styled(TableWithSelectableRows.BodyTr)`
  td:nth-of-type(1),
  td:nth-of-type(2),
  td:nth-of-type(3),
  td:nth-of-type(5) {
    text-overflow: unset;
  }
`

const CustomExpandedRowLabel = styled(ExpandedRowLabel)`
  flex: 0;
`

const StyledButton = styled(Button)`
  margin-top: 16px;
`
