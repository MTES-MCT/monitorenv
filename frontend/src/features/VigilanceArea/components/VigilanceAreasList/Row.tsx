import {
  ExpandableRowCell,
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowLabel,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { createPinnedCellStyle } from '@components/Table/TableWithSelectableRows/utils'
import { isMatchForRecurringOccurrence } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs, TableWithSelectableRows, THEME } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import { getColorWithAlpha } from '@utils/utils'
import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { FrequencyCell } from './Cells/FrequencyCell'
import { TagsDetailsCell } from './Cells/TagsDetailsCell'
import { ThemesDetailsCell } from './Cells/ThemesDetailsCell'
import { ValidationDateDetailsCell } from './Cells/ValidationDateDetailsCell'
import { BasePeriodCircle } from '../VigilanceAreaForm/Periods/Periods'

const ALL_TIMES_AND_CRITICAL = 'CRITICAL_AT_ALL_TIMES'
const ALL_TIMES_AND_SIMPLE = 'SIMPLE_AT_ALL_TIMES'

export function Row({ row, table }: { row: RowType<VigilanceArea.VigilanceArea>; table: any }) {
  const vigilanceArea: VigilanceArea.VigilanceArea = row.original

  const isVigilanceAreaActive = useMemo(() => {
    const hasAllTimePeriods = vigilanceArea.periods?.some(period => period.isAtAllTimes)
    const hasCriticalPeriod = vigilanceArea.periods?.some(period => period.isCritical)

    if (hasAllTimePeriods) {
      return hasCriticalPeriod ? ALL_TIMES_AND_CRITICAL : ALL_TIMES_AND_SIMPLE
    }

    const activePeriods = vigilanceArea.periods?.filter(period => {
      if (!period.frequency) {
        return false
      }
      const startDate = customDayjs(period.startDatePeriod).utc()
      const endDate = customDayjs(period.endDatePeriod).utc()
      const endDateFilter = customDayjs().utc().endOf('day')
      const startDateFilter = customDayjs().utc().startOf('day')
      const loopStopDate = period.computedEndDate
        ? customDayjs(period.computedEndDate)
        : customDayjs(endDate).add(5, 'year')

      return isMatchForRecurringOccurrence(
        startDate,
        endDate,
        startDateFilter,
        endDateFilter,
        period.frequency,
        loopStopDate
      )
    })

    if (!activePeriods?.length) {
      return undefined
    }

    return activePeriods.some(period => period.isCritical) ? ALL_TIMES_AND_CRITICAL : ALL_TIMES_AND_SIMPLE
  }, [vigilanceArea])

  return (
    <>
      <TableWithSelectableRows.BodyTr key={row.id} data-cy="vigilance-area-row">
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          let cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length,
            stickyLeftBorderIndex: 0
          })
          const isNew = table.options.meta?.isNew(row)
          const isUpdatedRecently = table.options.meta?.isUpdatedRecently(row)

          if (index === 0) {
            const borderLeftColor = isNew ? THEME.color.blueGray : getColorWithAlpha(THEME.color.blueGray, 0.4)

            if (isUpdatedRecently || isNew) {
              cellStyle = {
                ...cellStyle,
                borderLeft: `4px solid ${borderLeftColor}`
              }
            }
          }

          return (
            <ExpandableRowCell
              key={cell.id}
              $isDraft={vigilanceArea.isDraft}
              onClick={() => row.toggleExpanded()}
              style={cellStyle}
            >
              <>
                {(isVigilanceAreaActive === ALL_TIMES_AND_SIMPLE || isVigilanceAreaActive === ALL_TIMES_AND_CRITICAL) &&
                  index === 0 && <StyledPeriodCircle $isCritical={isVigilanceAreaActive === ALL_TIMES_AND_CRITICAL} />}

                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </>
            </ExpandableRowCell>
          )
        })}
      </TableWithSelectableRows.BodyTr>
      {row.getIsExpanded() && (
        <ExpandedRow $isDraft={vigilanceArea.isDraft} data-id={`${row.id}-expanded`}>
          <ExpandedRowCell>
            <ExpandedRowLabel>Commentaire</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comments}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <FrequencyCell periods={vigilanceArea.periods} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Thématiques et sous-thématiques</ExpandedRowLabel>
            <ThemesDetailsCell themes={vigilanceArea.themes} />
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowLabel>Tags et sous-tags</ExpandedRowLabel>
            <TagsDetailsCell tags={vigilanceArea.tags} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Dernière validation</ExpandedRowLabel>
            <ValidationDateDetailsCell date={vigilanceArea.validatedAt} />
            <ExpandedRowLabel>Dernière modification</ExpandedRowLabel>
            <ValidationDateDetailsCell date={vigilanceArea.updatedAt} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Créée par </ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.createdBy}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={3}>
            <ExpandedRowValue>
              {vigilanceArea.sources?.map(source => {
                const sourceLabel = source.type === VigilanceArea.VigilanceAreaSourceType.INTERNAL ? 'CACEM' : 'externe'

                return (
                  <Fragment key={source.id}>
                    <ExpandedRowLabel>Source {sourceLabel}</ExpandedRowLabel>
                    <span>{source.name}</span>
                  </Fragment>
                )
              })}
            </ExpandedRowValue>
          </ExpandedRowCell>
        </ExpandedRow>
      )}
    </>
  )
}

export const StyledPeriodCircle = styled(BasePeriodCircle)`
  margin-right: 8px;
`
