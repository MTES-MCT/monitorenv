import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingFormOnMap } from './Form'
import { hideSideButtons, setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { ReportingContext, ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
import { closeReporting } from '../../../domain/use_cases/reportings/closeReporting'
import { switchReporting } from '../../../domain/use_cases/reportings/switchReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { StyledChevronIcon, StyledHeader, StyledHeaderButtons, StyledTitle } from '../style'
import { getReportingTitle } from '../utils'

import type { Reporting as ReportingType } from '../../../domain/entities/reporting'

export function ReportingsOnMap() {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const selectedReporting = useMemo(
    () => selectedReportings.find(reporting => reporting.reporting.id === activeReportingId),
    [selectedReportings, activeReportingId]
  )

  const reportingsOnMap = useMemo(
    () =>
      (selectedReportings.length > 0 &&
        selectedReportings.filter(
          reporting => reporting.context === ReportingContext.MAP && activeReportingId !== reporting.reporting.id
        )) ||
      [],
    [selectedReportings, activeReportingId]
  )

  const reduceOrExpandReporting = id => {
    if (activeReportingId === id) {
      return reportingFormVisibility === ReportingFormVisibility.VISIBLE
        ? dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCED))
        : dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    }

    dispatch(hideSideButtons())

    return dispatch(switchReporting(id))
  }

  return (
    <>
      {activeReportingId && selectedReporting?.context === ReportingContext.MAP && (
        <ReportingFormOnMap totalMapReportings={reportingsOnMap.length + 1} />
      )}

      {reportingsOnMap.map((reporting, index) => {
        const reducedReporting: Partial<ReportingType> = reporting.reporting

        return (
          <StyledContainer
            key={reducedReporting.id}
            $position={index}
            $reportingFormVisibility={reportingFormVisibility}
          >
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
                  onClick={() => dispatch(closeReporting(reducedReporting.id))}
                />
              </StyledHeaderButtons>
            </StyledHeader>
          </StyledContainer>
        )
      })}
    </>
  )
}

const StyledContainer = styled.div<{ $position: number; $reportingFormVisibility: ReportingFormVisibility }>`
  background-color: transparent;
  position: absolute;
  bottom: ${p => p.$position * 52}px;
  width: 500px;
  height: 52px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;
  padding-top: 4px;
  ${p => {
    switch (p.$reportingFormVisibility) {
      case ReportingFormVisibility.VISIBLE_LEFT:
        return 'right: 56px;'
      case ReportingFormVisibility.REDUCED:
        return 'right: 12px;'
      default:
        return 'right: 8px;'
    }
  }}
`
