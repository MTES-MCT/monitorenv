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
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const selectedReporting = useMemo(
    () => selectedReportings.find(reporting => reporting.reporting.id === activeReportingId),
    [selectedReportings, activeReportingId]
  )

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
      await dispatch(reduceOrExpandReportingForm(ReportingContext.SIDE_WINDOW))
    }

    return dispatch(switchReporting(id, ReportingContext.SIDE_WINDOW))
  }

  // console.log('reportingsOnTable', reportingsOnTable)

  return (
    <>
      {activeReportingId && selectedReporting?.context === ReportingContext.SIDE_WINDOW && (
        <ReportingFormOnSideWindow totalTableReportings={reportingsOnTable.length + 1} />
      )}

      {reportingsOnTable.map((reporting, index) => {
        const reducedReporting: Partial<ReportingType> = reporting.reporting

        return (
          <StyledContainer key={reducedReporting.id} $position={index}>
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

const StyledContainer = styled.div<{ $position: number }>`
  background-color: transparent;
  position: absolute;
  bottom: ${p => p.$position * 52}px;
  right: 0px;
  width: 500px;
  height: 52px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;
  padding-top: 4px;
`
