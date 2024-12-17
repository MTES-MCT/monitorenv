import { getIsLinkingZonesToVigilanceArea } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { IconButton, Accent, Icon, Size, THEME } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { difference } from 'lodash'
import { useState } from 'react'

import { getExtentOfLayersGroup } from './getExtentOfLayersGroup'
import { LayerSelector } from './LayerSelector.style'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function MyLayerGroup({
  addZonesToVigilanceArea,
  children,
  groupName,
  layers,
  name,
  onRemoveZone,
  setTotalNumberOfZones,
  toggleLayerDisplay,
  totalNumberOfZones,
  zonesAreShowed,
  zonesLinkedToVigilanceArea
}: {
  addZonesToVigilanceArea: () => void
  children: React.ReactNode
  groupName: string
  layers: AMP[] | RegulatoryLayerCompact[]
  name: string
  onRemoveZone: (event) => void
  setTotalNumberOfZones: (totalNumberOfZones: number) => void
  toggleLayerDisplay: (event) => void
  totalNumberOfZones: number
  zonesAreShowed: boolean
  zonesLinkedToVigilanceArea: number[]
}) {
  const dispatch = useAppDispatch()

  const groupLayerIds = layers.map(l => l.id)
  const [zonesAreOpen, setZonesAreOpen] = useState(false)

  const isLayerGroupDisabled = difference(groupLayerIds, zonesLinkedToVigilanceArea).length === 0
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const fitToGroupExtent = () => {
    const extent = getExtentOfLayersGroup(layers)
    dispatch(setFitToExtent(extent))
  }

  const handleClickOnGroupName = () => {
    if (zonesAreOpen) {
      fitToGroupExtent()
    }

    setTotalNumberOfZones(zonesAreOpen ? 0 : totalNumberOfZones)
  }

  const toggleZonesAreOpen = () => {
    setZonesAreOpen(!zonesAreOpen)
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={zonesAreOpen} $isPadded onClick={toggleZonesAreOpen}>
        <LayerSelector.GroupName data-cy={`${name}-layer-topic`} onClick={handleClickOnGroupName} title={groupName}>
          {groupName}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.NumberOfZones>{`${layers?.length}/${totalNumberOfZones}`}</LayerSelector.NumberOfZones>
          {isLinkingZonesToVigilanceArea ? (
            <IconButton
              accent={Accent.TERTIARY}
              disabled={isLayerGroupDisabled}
              Icon={Icon.Plus}
              onClick={addZonesToVigilanceArea}
              title="Ajouter la/les zone(s) à la zone de vigilance"
            />
          ) : (
            <>
              <IconButton
                accent={Accent.TERTIARY}
                color={zonesAreShowed ? THEME.color.charcoal : THEME.color.lightGray}
                data-cy={zonesAreShowed ? `my-${name}-zone-hide` : `my-${name}-zone-show`}
                Icon={Icon.Display}
                onClick={toggleLayerDisplay}
                title={zonesAreShowed ? 'Cacher la/les zone(s)' : 'Afficher la/les zone(s)'}
              />

              <IconButton
                accent={Accent.TERTIARY}
                color={THEME.color.slateGray}
                data-cy={`my-${name}-zone-delete`}
                Icon={Icon.Close}
                onClick={onRemoveZone}
                size={Size.SMALL}
                title="Supprimer la/les zone(s) de ma sélection"
              />
            </>
          )}
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.GroupList $isOpen={zonesAreOpen} $length={layers?.length}>
        {children}
      </LayerSelector.GroupList>
    </>
  )
}
