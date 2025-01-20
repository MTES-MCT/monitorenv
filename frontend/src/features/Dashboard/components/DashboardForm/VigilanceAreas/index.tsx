import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { Layer } from './Layer'
import { Panel } from './Panel'
import { SelectedLayerList, StyledLayerList } from '../style'

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
    const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS))
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    const { selectedVigilanceAreas } = useGetVigilanceAreasQuery(undefined, {
      selectFromResult: ({ data }) => ({
        selectedVigilanceAreas: Object.values(data?.entities ?? []).filter(vigilanceArea =>
          selectedVigilanceAreaIds.includes(vigilanceArea.id)
        )
      })
    })

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    return (
      <div>
        {openPanel && !!columnWidth && <StyledPanel $marginLeft={columnWidth} layerId={openPanel.id} />}

        <Accordion
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title="Zones de vigilance"
          titleRef={ref}
        >
          <StyledLayerList
            $baseLayersLength={vigilanceAreas.length}
            $showBaseLayers={isExpanded}
            data-cy="dashboard-vigilance-areas-list"
          >
            {vigilanceAreas.map(vigilanceArea => (
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
  bottom: 0;
`
