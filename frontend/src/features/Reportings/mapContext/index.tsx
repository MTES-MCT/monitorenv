import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingFormOnMap } from './Form'
import { hideSideButtons } from '../../../domain/shared_slices/Global'
import { ReportingContext, VisibilityState } from '../../../domain/shared_slices/ReportingState'
import { closeReporting } from '../../../domain/use_cases/reportings/closeReporting'
import { reduceOrExpandReportingForm } from '../../../domain/use_cases/reportings/reduceOrExpandReportingForm'
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

  const reportingsOnMap = useMemo(
    () =>
      (selectedReportings.length > 0 &&
        selectedReportings.filter(
          reporting => reporting.context === ReportingContext.MAP && activeReportingId !== reporting.reporting.id
        )) ||
      [],
    [selectedReportings, activeReportingId]
  )

  const reduceOrExpandReporting = async id => {
    if (activeReportingId === id && reportingFormVisibility.context === ReportingContext.MAP) {
      return dispatch(reduceOrExpandReportingForm(ReportingContext.MAP))
    }

    dispatch(hideSideButtons())

    return dispatch(switchReporting(id, ReportingContext.MAP))
  }

  return (
    <>
      <ReportingFormOnMap totalMapReportings={reportingsOnMap.length} />

      {reportingsOnMap.map((reporting, index) => {
        const reducedReporting: Partial<ReportingType> = reporting.reporting
        const isSeparatorVisible = !!(
          (index < reportingsOnMap.length &&
            activeReportingId &&
            reportingFormVisibility.context === ReportingContext.MAP) ||
          !(
            index + 1 === reportingsOnMap.length &&
            (!activeReportingId || reportingFormVisibility.context === ReportingContext.SIDE_WINDOW)
          )
        )

        return (
          <StyledContainer
            key={reducedReporting.id}
            $position={index}
            $reportingFormVisibility={reportingFormVisibility.visibility}
          >
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
                  onClick={() => dispatch(closeReporting(reducedReporting.id, ReportingContext.MAP))}
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
  height: 4px;
  width: 100%;
  background-color: white;
  position: absolute;
  display: ${p => (p.$visible ? 'block' : 'none')};
`

const StyledContainer = styled.div<{ $position: number; $reportingFormVisibility: VisibilityState }>`
  background-color: transparent;
  position: absolute;
  bottom: ${p => p.$position * 52}px;
  width: 500px;
  height: 52px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: top 0.5s ease-out;
  z-index: 100;
  ${p => {
    switch (p.$reportingFormVisibility) {
      case VisibilityState.VISIBLE_LEFT:
        return 'right: 56px;'
      case VisibilityState.REDUCED:
        return 'right: 12px;'
      default:
        return 'right: 8px;'
    }
  }}
`
