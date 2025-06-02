import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { ResultNumber, SelectedLayerList, StyledLayerList } from '../style'
import { StyledToggleSelectAll } from '../ToggleSelectAll'
import { Layer } from './Layer'
import { Panel } from './Panel'
import { getSelectionState, handleSelection } from '../ToggleSelectAll/utils'

type VigilanceAreasProps = {
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  selectedVigilanceAreaIds: number[]
  setExpandedAccordion: () => void
  vigilanceAreas: VigilanceArea.VigilanceAreaFromApi[] | VigilanceArea.VigilanceAreaLayer[]
}
export const VigilanceAreas = forwardRef<HTMLDivElement, VigilanceAreasProps>(
  (
    {
      columnWidth,
      isExpanded,
      isSelectedAccordionOpen,
      selectedVigilanceAreaIds,
      setExpandedAccordion,
      vigilanceAreas
    },
    ref
  ) => {
    const dispatch = useAppDispatch()
    const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS))
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    const sortedVigilanecAreas = [...vigilanceAreas].sort((a, b) => a.name.localeCompare(b.name))

    const { selectedVigilanceAreas } = useGetVigilanceAreasQuery(undefined, {
      selectFromResult: ({ data }) => ({
        selectedVigilanceAreas: Object.values(data?.entities ?? [])
          .filter(vigilanceArea => selectedVigilanceAreaIds.includes(vigilanceArea.id))
          .sort((a, b) => a.name.localeCompare(b.name))
      })
    })

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const selectionState = useMemo(
      () =>
        getSelectionState(
          selectedVigilanceAreaIds,
          vigilanceAreas.map(amp => amp.id)
        ),
      [selectedVigilanceAreaIds, vigilanceAreas]
    )

    return (
      <div>
        {openPanel && !!columnWidth && <StyledPanel $marginLeft={columnWidth} layerId={openPanel.id} />}

        <Accordion
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Zones de vigilance</Title>
              <ResultNumber>{`(${vigilanceAreas.length} ${pluralize(
                'résultat',
                vigilanceAreas.length
              )})`}</ResultNumber>
              {(vigilanceAreas.length !== 0 || selectedVigilanceAreaIds.length !== 0) && (
                <StyledToggleSelectAll
                  onSelection={() =>
                    handleSelection({
                      allIds: vigilanceAreas.map(
                        (vigilanceArea: VigilanceArea.VigilanceAreaFromApi | VigilanceArea.VigilanceAreaLayer) =>
                          vigilanceArea.id
                      ),
                      onRemove: payload => dispatch(dashboardActions.removeItems(payload)),
                      onSelect: payload => dispatch(dashboardActions.addItems(payload)),
                      selectedIds: selectedVigilanceAreaIds,
                      selectionState,
                      type: Dashboard.Block.VIGILANCE_AREAS
                    })
                  }
                  selectionState={selectionState}
                />
              )}
            </TitleContainer>
          }
          titleRef={ref}
        >
          <StyledLayerList
            $baseLayersLength={sortedVigilanecAreas.length}
            $showBaseLayers={isExpanded}
            data-cy="dashboard-vigilance-areas-list"
          >
            {sortedVigilanecAreas.map(vigilanceArea => (
              <Layer
                key={vigilanceArea.id}
                isPinned={selectedVigilanceAreaIds.includes(vigilanceArea.id)}
                isSelected={false}
                vigilanceArea={vigilanceArea}
              />
            ))}
          </StyledLayerList>
        </Accordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedVigilanceAreaIds.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedVigilanceAreaIds.length} ${pluralize('zone', selectedVigilanceAreaIds.length)} ${pluralize(
            'sélectionnée',
            selectedVigilanceAreaIds.length
          )}`}
        >
          <SelectedLayerList>
            {selectedVigilanceAreas?.map(vigilanceArea => (
              <Layer key={vigilanceArea.id} isSelected vigilanceArea={vigilanceArea} />
            ))}
          </SelectedLayerList>
        </SelectedAccordion>
      </div>
    )
  }
)

const StyledPanel = styled(Panel)<{ $marginLeft: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 24px + 4px
  )`}; // 24px is the padding, 64px is the width of the sidebar, 4px is the margin
`
