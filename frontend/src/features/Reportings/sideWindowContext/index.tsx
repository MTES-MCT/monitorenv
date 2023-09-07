import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingFormOnSideWindow } from './Form'
import { ReportingContext } from '../../../domain/shared_slices/ReportingState'
import { closeReporting } from '../../../domain/use_cases/reportings/closeReporting'
import { reduceOrExpandReportingForm } from '../../../domain/use_cases/reportings/reduceOrExpandReportingForm'
import { switchReporting } from '../../../domain/use_cases/reportings/switchReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { StyledChevronIcon, StyledHeader, StyledHeaderButtons, StyledTitle } from '../style'
import { getReportingTitle } from '../utils'

import type { Reporting as ReportingType } from '../../../domain/entities/reporting'

export function ReportingsOnSideWindow() {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const reportingsOnTable = useMemo(
    () =>
      (selectedReportings.length > 0 &&
        selectedReportings.filter(
          reporting =>
            reporting.context === ReportingContext.SIDE_WINDOW && activeReportingId !== reporting.reporting.id
        )) ||
      [],
    [selectedReportings, activeReportingId]
  )

  const reduceOrExpandReporting = async id => {
    if (activeReportingId === id) {
      return dispatch(reduceOrExpandReportingForm(ReportingContext.SIDE_WINDOW))
    }

    return dispatch(switchReporting(id, ReportingContext.SIDE_WINDOW))
  }

  return (
    <>
      <ReportingFormOnSideWindow totalTableReportings={reportingsOnTable.length} />

      {reportingsOnTable.map((reporting, index) => {
        const reducedReporting: Partial<ReportingType> = reporting.reporting
        const isSeparatorVisible = !!(
          (index < reportingsOnTable.length &&
            activeReportingId &&
            reportingFormVisibility.context === ReportingContext.SIDE_WINDOW) ||
          !(
            index + 1 === reportingsOnTable.length &&
            (!activeReportingId || reportingFormVisibility.context === ReportingContext.MAP)
          )
        )

        return (
          <StyledContainer key={reducedReporting.id} $position={index}>
            <Separator $visible={isSeparatorVisible} />
            <StyledHeader>
              <StyledTitle>
                <Icon.Report />
                {getReportingTitle(reducedReporting)}
              </StyledTitle>

              <StyledHeaderButtons>
                <StyledChevronIcon
                  $isOpen
                  accent={Accent.TERTIARY}
                  Icon={Icon.Chevron}
                  onClick={() => reduceOrExpandReporting(reducedReporting.id)}
                />
                <IconButton
                  accent={Accent.TERTIARY}
                  Icon={Icon.Close}
                  onClick={() => dispatch(closeReporting(reducedReporting.id, ReportingContext.SIDE_WINDOW))}
                />
              </StyledHeaderButtons>
            </StyledHeader>
          </StyledContainer>
        )
      })}
    </>
  )
}

const Separator = styled.div<{ $visible: boolean }>`
  height: 2px;
  width: 100%;
  background-color: white;
  position: absolute;
  display: ${p => (p.$visible ? 'block' : 'none')};
`

const StyledContainer = styled.div<{ $position: number }>`
  background-color: transparent;
  position: absolute;
  bottom: ${p => p.$position * 52}px;
  right: 0px;
  width: 500px;
  height: 52px;
  overflow: hidden;
  display: flex;
  transition: top 0.5s ease-out;
  z-index: 100;
`
