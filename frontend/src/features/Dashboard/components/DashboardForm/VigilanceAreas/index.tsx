import { getFilteredVigilanceAreas, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Layer } from './Layer'
import { Panel } from './Panel'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

type VigilanceAreasProps = {
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  selectedVigilanceAreaIds: number[]

  setExpandedAccordion: () => void
  vigilanceAreas: VigilanceArea.VigilanceArea[] | undefined
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
    const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS))
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    const selectedVigilanceAreas = vigilanceAreas?.filter(({ id }) => selectedVigilanceAreaIds?.includes(id))

    const filteredVigilanceAreas = useAppSelector(state => getFilteredVigilanceAreas(state.dashboard))

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    return (
      <StickyContainer ref={ref}>
        {openPanel && <StyledPanel $marginLeft={columnWidth ?? 0} layerId={openPanel.id} />}

        <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones de vigilance">
          <StyledLayerList
            $baseLayersLength={filteredVigilanceAreas?.length ?? 0}
            $maxHeight={100}
            $showBaseLayers={isExpanded}
            data-cy="dashboard-vigilance-areas-list"
          >
            {filteredVigilanceAreas?.map(vigilanceArea => (
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
          {selectedVigilanceAreas?.map(vigilanceArea => (
            <Layer key={vigilanceArea.id} isSelected vigilanceArea={vigilanceArea} />
          ))}
        </SelectedAccordion>
      </StickyContainer>
    )
  }
)

const StyledLayerList = styled(LayerSelector.LayerList)`
  overflow-y: auto;
  max-height: 30%;
`
const StyledPanel = styled(Panel)<{ $marginLeft: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 24px + 4px
  )`}; // 24px is the padding, 64px is the width of the sidebar, 4px is the margin
`

const StickyContainer = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
`
