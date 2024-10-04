import { getFilteredVigilanceAreas, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Layer } from './Layer'
import { Panel } from './Panel'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

type VigilanceAreasProps = {
  columnWidth: number
  dashboardId: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  setExpandedAccordion: () => void
  vigilanceAreas: VigilanceArea.VigilanceArea[] | undefined
}
export function VigilanceAreas({
  columnWidth,
  dashboardId,
  isExpanded,
  isSelectedAccordionOpen,
  setExpandedAccordion,
  vigilanceAreas
}: VigilanceAreasProps) {
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS))
  const selectedLayerIds = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.VIGILANCE_AREAS]
  )
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  const selectedVigilanceAreas = vigilanceAreas?.filter(({ id }) => selectedLayerIds?.includes(id))

  const filteredVigilanceAreas = useAppSelector(state => getFilteredVigilanceAreas(state.dashboard))

  useEffect(() => {
    if (isSelectedAccordionOpen) {
      setExpandedSelectedAccordion(isSelectedAccordionOpen)
    }
  }, [isSelectedAccordionOpen])

  return (
    <div>
      {openPanel && <StyledPanel $marginLeft={columnWidth ?? 0} layerId={openPanel.id} />}

      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones de vigilance">
        <StyledLayerList
          $baseLayersLength={filteredVigilanceAreas?.length ?? 0}
          $maxHeight={100}
          $showBaseLayers={isExpanded}
        >
          {filteredVigilanceAreas?.map(vigilanceArea => (
            <Layer key={vigilanceArea.id} dashboardId={dashboardId} isSelected={false} vigilanceArea={vigilanceArea} />
          ))}
        </StyledLayerList>
      </Accordion>
      <SelectedAccordion
        isExpanded={isExpandedSelectedAccordion}
        isReadOnly={selectedLayerIds?.length === 0}
        setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
        title={`${selectedLayerIds?.length ?? 0} ${pluralize('zone', selectedLayerIds?.length ?? 0)} ${pluralize(
          'sélectionnée',
          selectedLayerIds?.length ?? 0
        )}`}
      >
        {selectedVigilanceAreas?.map(vigilanceArea => (
          <Layer key={vigilanceArea.id} dashboardId={dashboardId} isSelected vigilanceArea={vigilanceArea} />
        ))}
      </SelectedAccordion>
    </div>
  )
}

const StyledLayerList = styled(LayerSelector.LayerList)`
  height: auto;
`
const StyledPanel = styled(Panel)<{ $marginLeft: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 24px + 64px + 4px
  )`}; // 24px is the padding, 64px is the width of the sidebar, 4px is the margin
`
