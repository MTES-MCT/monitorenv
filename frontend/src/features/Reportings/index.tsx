import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Reporting } from './ReportingForm'
import { StyledChevronIcon, StyledHeader, StyledHeaderButtons, StyledTitle } from './style'
import { getReportingTitle } from './utils'
import { hideSideButtons, setReportingFormVisibility } from '../../domain/shared_slices/Global'
import { ReportingContext, ReportingFormVisibility } from '../../domain/shared_slices/ReportingState'
import { closeReporting } from '../../domain/use_cases/reportings/closeReporting'
import { switchReporting } from '../../domain/use_cases/reportings/switchReporting'
import { useAppSelector } from '../../hooks/useAppSelector'

import type { Reporting as ReportingType } from '../../domain/entities/reporting'

export function Reportings() {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const reportingsOnMap = useMemo(
    () =>
      selectedReportings.filter(
        reporting => reporting.context === ReportingContext.MAP && activeReportingId !== reporting.reporting.id
      ),
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
      {activeReportingId && <Reporting />}

      {reportingsOnMap.map((reporting, index) => {
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

const StyledContainer = styled.div<{ $position: number }>`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  bottom: ${p => p.$position * 52}px;
  width: 500px;
  height: 52px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;
  right: 12px;
  top: calc(100vh - 52px);
`
