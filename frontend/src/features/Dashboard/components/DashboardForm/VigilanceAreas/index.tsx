import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { Layer } from './Layer'
import { Panel } from './Panel'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

import type { VigilanceArea } from '@features/VigilanceArea/types'

type VigilanceAreasProps = {
  columnWidth: number
  dashboardId: number
  isExpanded: boolean
  setExpandedAccordion: () => void
  vigilanceAreas: VigilanceArea.VigilanceArea[] | undefined
}
export function VigilanceAreas({
  columnWidth,
  dashboardId,
  isExpanded,
  setExpandedAccordion,
  vigilanceAreas
}: VigilanceAreasProps) {
  const selectedLayerIds = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.VIGILANCE_AREAS]
  )
  const [isExpandedSmallAccordion, setExpandedSmallAccordion] = useState(false)

  const selectedVigilanceAreas = vigilanceAreas?.filter(({ id }) => selectedLayerIds?.includes(id))

  return (
    <div>
      <StyledPanel $marginLeft={columnWidth ?? 0} className="vigilance-area-panel" dashboardId={dashboardId} />

      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones de vigilance">
        <StyledLayerList $baseLayersLength={vigilanceAreas?.length ?? 0} $maxHeight={100} $showBaseLayers={isExpanded}>
          {vigilanceAreas?.map(vigilanceArea => (
            <Layer key={vigilanceArea.id} dashboardId={dashboardId} isSelected={false} vigilanceArea={vigilanceArea} />
          ))}
        </StyledLayerList>
      </Accordion>
      <SelectedAccordion
        isExpanded={isExpandedSmallAccordion}
        isReadOnly={selectedLayerIds?.length === 0}
        setExpandedAccordion={() => setExpandedSmallAccordion(!isExpandedSmallAccordion)}
        title={`${selectedLayerIds?.length ?? 0} ${pluralize('zone', selectedLayerIds?.length ?? 0)} ${pluralize(
          'sélectionée',
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
    ${p.$marginLeft}px + 40px + 64px
  )`}; // 40px is the padding, 64px is the width of the sidebar
`
