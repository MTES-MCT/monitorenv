import { getFilteredAmps, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ListLayerGroup } from './ListLayerGroup'
import { AmpPanel } from './Panel'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

import type { AMPFromAPI } from 'domain/entities/AMPs'

type AmpsProps = {
  amps: AMPFromAPI[] | undefined
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  selectedAmpIds: number[]
  setExpandedAccordion: () => void
}
export function Amps({
  amps,
  columnWidth,
  isExpanded,
  isSelectedAccordionOpen,
  selectedAmpIds,
  setExpandedAccordion
}: AmpsProps) {
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))

  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  const filteredAmps = useAppSelector(state => getFilteredAmps(state.dashboard))
  const ampsByLayerName = groupBy(filteredAmps, r => r.name)

  const selectedAmpByLayerName = groupBy(
    amps?.filter(({ id }) => selectedAmpIds.includes(id)),
    r => r.name
  )

  useEffect(() => {
    if (isSelectedAccordionOpen) {
      setExpandedSelectedAccordion(isSelectedAccordionOpen)
    }
  }, [isSelectedAccordionOpen])

  return (
    <div>
      {openPanel && <StyledPanel $marginLeft={columnWidth ?? 0} layerId={openPanel.id} />}
      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones AMP">
        <StyledLayerList
          $baseLayersLength={Object.values(ampsByLayerName).length}
          $maxHeight={100}
          $showBaseLayers={isExpanded}
        >
          {Object.entries(ampsByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
            const layersId = layerIdsInGroup.map((layerId: AMPFromAPI) => layerId.id)

            return (
              <ListLayerGroup
                key={layerGroupName}
                groupName={layerGroupName}
                layerIds={layersId}
                selectedAmpIds={selectedAmpIds}
              />
            )
          })}
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
        {Object.entries(selectedAmpByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
          const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

          return (
            <ListLayerGroup
              key={layerGroupName}
              groupName={layerGroupName}
              isSelected
              layerIds={layersId}
              selectedAmpIds={selectedAmpIds}
            />
          )
        })}
      </SelectedAccordion>
    </div>
  )
}

const StyledLayerList = styled(LayerSelector.LayerList)`
  height: auto;
`

const StyledPanel = styled(AmpPanel)<{ $marginLeft?: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 25px + 4px
  )`}; // 25px is the padding, 64px is the width of the sidebar
`
