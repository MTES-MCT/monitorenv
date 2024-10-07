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
  dashboardId: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  setExpandedAccordion: () => void
}
export function Amps({
  amps,
  columnWidth,
  dashboardId,
  isExpanded,
  isSelectedAccordionOpen,
  setExpandedAccordion
}: AmpsProps) {
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))

  const selectedLayerIds = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.AMP])
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  const filteredAmps = useAppSelector(state => getFilteredAmps(state.dashboard))
  const ampsByLayerName = groupBy(filteredAmps, r => r.name)

  const selectedAmpIds = amps?.filter(({ id }) => selectedLayerIds?.includes(id))
  const selectedAmpByLayerName = groupBy(selectedAmpIds, r => r.name)

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
                dashboardId={dashboardId}
                groupName={layerGroupName}
                layerIds={layersId}
              />
            )
          })}
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
        {Object.entries(selectedAmpByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
          const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

          return (
            <ListLayerGroup
              key={layerGroupName}
              dashboardId={dashboardId}
              groupName={layerGroupName}
              isSelected
              layerIds={layersId}
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
    ${p.$marginLeft}px + 25px + 64px + 4px
  )`}; // 25px is the padding, 64px is the width of the sidebar
`
