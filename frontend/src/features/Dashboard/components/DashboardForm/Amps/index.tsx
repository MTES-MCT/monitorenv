import { useGetAMPsQuery } from '@api/ampsAPI'
import { getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { ListLayerGroup } from './ListLayerGroup'
import { AmpPanel } from './Panel'

import type { AMP, AMPFromAPI } from 'domain/entities/AMPs'

type AmpsProps = {
  amps: AMPFromAPI[]
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  selectedAmpIds: number[]
  setExpandedAccordion: () => void
}
export const Amps = forwardRef<HTMLDivElement, AmpsProps>(
  ({ amps, columnWidth, isExpanded, isSelectedAccordionOpen, selectedAmpIds, setExpandedAccordion }, ref) => {
    const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))

    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    const ampsByLayerName = groupBy(amps, r => r.name)

    const { selectedAmpByLayerName } = useGetAMPsQuery(undefined, {
      selectFromResult: ({ data }) => ({
        selectedAmpByLayerName: groupBy(
          Object.values(data?.entities ?? []).filter(amp => selectedAmpIds.includes(amp.id)),
          amp => amp.name
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
        <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones AMP" titleRef={ref}>
          <StyledLayerList
            $baseLayersLength={Object.values(ampsByLayerName).length}
            $maxHeight={100}
            $showBaseLayers={isExpanded}
            data-cy="dashboard-amp-list"
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
            const layersId = layerIdsInGroup.map((layerId: AMP) => layerId.id)

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
)

const StyledLayerList = styled(LayerSelector.LayerList)`
  overflow: hidden;
  height: auto;
`

const StyledPanel = styled(AmpPanel)<{ $marginLeft?: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 25px + 4px
  )`}; // 25px is the padding, 64px is the width of the sidebar
`
