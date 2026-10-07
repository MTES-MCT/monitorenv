import { useGetAMPsByIdsQuery } from '@api/ampsAPI'
import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Axis } from '../../../../../types'
import { Accordion, Title, TitleContainer } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { ResultNumber, SelectedLayerList, StyledLayerList } from '../style'
import { StyledToggleSelectAll } from '../ToggleSelectAll'
import { ListLayerGroup } from './ListLayerGroup'
import { AmpPanel } from './Panel'
import { getSelectionState, handleSelection } from '../ToggleSelectAll/utils'

import type { AMP } from '../../../../../domain/entities/AMPs'

type AmpsProps = {
  amps: AMP[]
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  selectedAmpIds: number[]
  setExpandedAccordion: () => void
}
export const Amps = forwardRef<HTMLDivElement, AmpsProps>(
  ({ amps, columnWidth, isExpanded, isSelectedAccordionOpen, selectedAmpIds, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))

    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)
    const { data } = useGetAMPsByIdsQuery({ axis: String(Axis.NORTH_SOUTH), ids: selectedAmpIds })

    const ampsGroupedByName = groupBy(
      [...amps].sort((a, b) => a.name.localeCompare(b.name)),
      r => r.name
    )

    const selectedAmpByName = groupBy(
      [...(data ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
      r => r.name
    )

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const selectionState = useMemo(
      () =>
        getSelectionState(
          selectedAmpIds,
          amps.map(amp => amp.id)
        ),
      [amps, selectedAmpIds]
    )

    return (
      <div>
        {openPanel && !!columnWidth && <StyledPanel $marginLeft={columnWidth} layerId={openPanel.id} />}
        <Accordion
          controls={
            (amps.length !== 0 || selectedAmpIds.length !== 0) && (
              <StyledToggleSelectAll
                onSelection={() =>
                  handleSelection({
                    allIds: amps.map(amp => amp.id),
                    onRemove: payload => dispatch(dashboardActions.removeItems(payload)),
                    onSelect: payload => dispatch(dashboardActions.addItems(payload)),
                    selectedIds: selectedAmpIds,
                    selectionState,
                    type: Dashboard.Block.AMP
                  })
                }
                selectionState={selectionState}
              />
            )
          }
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Zones AMP</Title>
              <ResultNumber>{`(${amps.length} ${pluralize('résultat', amps.length)})`}</ResultNumber>
            </TitleContainer>
          }
          titleRef={ref}
        >
          <StyledLayerList
            $baseLayersLength={Object.values(ampsGroupedByName).length}
            $maxHeight={100}
            $showBaseLayers={isExpanded}
            data-cy="dashboard-amp-list"
          >
            {Object.entries(ampsGroupedByName).map(([groupName, ampsGrouped]) => (
              <ListLayerGroup
                key={groupName}
                amps={ampsGrouped}
                groupName={groupName}
                selectedAmpIds={selectedAmpIds}
              />
            ))}
          </StyledLayerList>
        </Accordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedAmpIds.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedAmpIds.length} ${pluralize('zone', selectedAmpIds.length)} ${pluralize(
            'sélectionnée',
            selectedAmpIds.length
          )}`}
        >
          <SelectedLayerList>
            {Object.entries(selectedAmpByName).map(([groupName, ampsGrouped]) => (
              <ListLayerGroup
                key={groupName}
                amps={ampsGrouped}
                groupName={groupName}
                isSelected
                selectedAmpIds={selectedAmpIds}
              />
            ))}
          </SelectedLayerList>
        </SelectedAccordion>
      </div>
    )
  }
)

const StyledPanel = styled(AmpPanel)<{ $marginLeft?: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 25px + 4px
  )`}; // 25px is the padding, 64px is the width of the sidebar
  z-index: 10;
`
