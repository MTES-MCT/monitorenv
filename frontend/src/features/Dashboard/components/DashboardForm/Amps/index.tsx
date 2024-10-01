import { getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ListLayerGroup } from './ListLayerGroup'
import { AmpPanel } from './Panel'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

import type { AMPFromAPI } from 'domain/entities/AMPs'

type AmpsProps = {
  amps: AMPFromAPI[] | undefined
  dashboardId: number
  isExpanded: boolean
  setExpandedAccordion: () => void
}
export function Amps({ amps, dashboardId, isExpanded, setExpandedAccordion }: AmpsProps) {
  const [isMounted, setisMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    function updateSize() {
      if (ref.current) {
        setWidth(ref.current.clientWidth)
      }
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))

  const selectedLayerIds = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.AMP])
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  const ampssByLayerName = groupBy(amps, r => r.name)

  const selectedAmpIds = amps?.filter(({ id }) => selectedLayerIds?.includes(id))
  const selectedAmpByLayerName = groupBy(selectedAmpIds, r => r.name)

  useEffect(() => {
    setisMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && ref.current) {
      setWidth(ref.current.clientWidth)
    }
  }, [isMounted])

  return (
    <div ref={ref}>
      {isMounted && (
        <>
          {openPanel && <StyledPanel $marginLeft={width} layerId={openPanel.id} />}
          <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones AMP">
            <StyledLayerList
              $baseLayersLength={Object.values(ampssByLayerName).length}
              $maxHeight={100}
              $showBaseLayers={isExpanded}
            >
              {Object.entries(ampssByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
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
              'sélectionée',
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
        </>
      )}
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
