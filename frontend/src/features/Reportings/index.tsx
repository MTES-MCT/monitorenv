import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingFormWithContext } from './ReportingForm'
import { StyledChevronIcon, StyledHeader, StyledHeaderButtons, StyledTitle } from './style'
import { getReportingTitle } from './utils'
import { hideSideButtons, ReportingContext, VisibilityState } from '../../domain/shared_slices/Global'
import { closeReporting } from '../../domain/use_cases/reportings/closeReporting'
import { reduceOrExpandReportingForm } from '../../domain/use_cases/reportings/reduceOrExpandReportingForm'
import { switchReporting } from '../../domain/use_cases/reportings/switchReporting'
import { useAppSelector } from '../../hooks/useAppSelector'

export function Reportings({ context }: { context: ReportingContext }) {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()
  const reportingsOnMap = useMemo(
    () =>
      (selectedReportings &&
        Object.values(selectedReportings).filter(
          reporting => reporting.context === context && activeReportingId !== reporting?.reporting?.id
        )) ||
      [],
    [selectedReportings, activeReportingId, context]
  )

  const reduceOrExpandReporting = async id => {
    if (activeReportingId === id && reportingFormVisibility.context === context) {
      return dispatch(reduceOrExpandReportingForm(context))
    }

    dispatch(hideSideButtons())

    return dispatch(switchReporting(id, context))
  }

  return (
    <>
      {reportingFormVisibility.context === context && (
        <ReportingFormWithContext key={context} context={context} totalMapReportings={reportingsOnMap.length} />
      )}

      {reportingsOnMap.map((reporting, index) => {
        const reducedReporting = reporting.reporting
        const isSeparatorVisible = !!(
          (index < reportingsOnMap.length && activeReportingId && reportingFormVisibility.context === context) ||
          !(index + 1 === reportingsOnMap.length && (!activeReportingId || reportingFormVisibility.context !== context))
        )

        return (
          <StyledContainer
            key={reducedReporting?.id}
            $context={context}
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
                  onClick={() => reduceOrExpandReporting(reducedReporting?.id)}
                />
                <IconButton
                  accent={Accent.TERTIARY}
                  Icon={Icon.Close}
                  onClick={() => dispatch(closeReporting(reducedReporting?.id, context))}
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

const StyledContainer = styled.div<{
  $context: ReportingContext
  $position: number
  $reportingFormVisibility: VisibilityState
}>`
  background-color: transparent;
  position: absolute;
  bottom: ${p => p.$position * 52}px;
  width: 500px;
  height: 52px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;
  ${p => {
    switch (p.$reportingFormVisibility) {
      case VisibilityState.VISIBLE_LEFT:
        return 'right: 56px;'
      case VisibilityState.REDUCED:
        return 'right: 12px;'
      default:
        return `right: ${p.$context === ReportingContext.MAP ? '8px' : '0px'};`
    }
  }}
`
