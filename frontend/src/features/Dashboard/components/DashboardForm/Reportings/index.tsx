import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { pluralize } from '@mtes-mct/monitor-ui'
import { uniq } from 'lodash'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { ResultNumber } from '../style'
import { Filters } from './Filters'
import { Layer } from './Layer'
import { StyledToggleSelectAll } from '../ToggleSelectAll'
import { getSelectionState, handleSelection } from '../ToggleSelectAll/utils'

import type { Reporting } from 'domain/entities/reporting'

type ReportingsProps = {
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  reportings: Reporting[]
  selectedReportingIds: number[]
  setExpandedAccordion: () => void
}
export const Reportings = forwardRef<HTMLDivElement, ReportingsProps>(
  ({ isExpanded, isSelectedAccordionOpen, reportings, selectedReportingIds, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const { data: selectedReportings } = useGetReportingsByIdsQuery(selectedReportingIds)

    const selectionState = useMemo(
      () =>
        getSelectionState(
          selectedReportingIds,
          reportings.map(reporting => +reporting.id)
        ),
      [selectedReportingIds, reportings]
    )

    const uniqReportingsIds = uniq([...selectedReportingIds, ...reportings.map(reporting => +reporting.id)])

    return (
      <div>
        <Accordion
          isExpanded={isExpanded}
          name="reportings"
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Signalements</Title>
              <ResultNumber>{`(${reportings.length} ${pluralize('résultat', reportings.length)})`}</ResultNumber>
              {(reportings.length !== 0 || selectedReportingIds.length !== 0) && (
                <StyledToggleSelectAll
                  onSelection={() =>
                    handleSelection({
                      allIds: uniqReportingsIds,
                      onRemove: payload => dispatch(dashboardActions.removeItems(payload)),
                      onSelect: payload => dispatch(dashboardActions.addItems(payload)),
                      selectedIds: selectedReportingIds,
                      selectionState,
                      type: Dashboard.Block.REPORTINGS
                    })
                  }
                  selectionState={selectionState}
                />
              )}
            </TitleContainer>
          }
          titleRef={ref}
        >
          <StyledFilters $isExpanded={isExpanded} />
          {reportings?.map(reporting => (
            <Layer key={reporting.id} isPinned={selectedReportingIds.includes(+reporting.id)} reporting={reporting} />
          ))}
        </Accordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedReportingIds?.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedReportingIds?.length ?? 0} ${pluralize(
            'signalement',
            selectedReportingIds?.length ?? 0
          )} ${pluralize('sélectionné', selectedReportingIds?.length ?? 0)}`}
        >
          {Object.values(selectedReportings?.entities ?? []).map(reporting => (
            <Layer key={reporting.id} isSelected reporting={reporting} />
          ))}
        </SelectedAccordion>
      </div>
    )
  }
)

const StyledFilters = styled(Filters)<{ $isExpanded: boolean }>`
  visibility: ${({ $isExpanded }) => ($isExpanded ? 'visible' : 'hidden')};
  transition-delay: ${({ $isExpanded }) => ($isExpanded ? '0.3s' : '0')};
`
