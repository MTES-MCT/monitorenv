import { InlineTransparentButton } from '@components/style'
import { ChevronIconButton } from '@features/commonStyles/icons/ChevronIconButton'
import { useMountTransition } from '@hooks/useMountTransition'
import styled from 'styled-components'

import { AdministrativeLayer } from './AdministrativeLayer'
import { administrativeLayers } from '../../../domain/entities/administrativeLayers'
import { layerSidebarActions } from '../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'

export function AdministrativeLayers() {
  const dispatch = useAppDispatch()
  const administrativeZonesIsOpen = useAppSelector(state => state.layerSidebar.administrativeZonesIsOpen)

  const onSectionTitleClicked = () => {
    dispatch(layerSidebarActions.toggleAdministrativeZones())
  }
  const hasTransition = useMountTransition(administrativeZonesIsOpen, 500)

  return (
    <>
      <LayerSelector.Wrapper data-cy="administrative-zones-open">
        <InlineTransparentButton onClick={onSectionTitleClicked}>
          <LayerSelector.Title>Zones administratives</LayerSelector.Title>
        </InlineTransparentButton>
        <ChevronIconButton $isOpen={administrativeZonesIsOpen} onClick={onSectionTitleClicked} />
      </LayerSelector.Wrapper>
      {(hasTransition || administrativeZonesIsOpen) && administrativeLayers.length ? (
        <ZonesList $showZones={hasTransition && administrativeZonesIsOpen} $zonesLength={administrativeLayers.length}>
          {administrativeLayers.map(layers => {
            if (layers.length === 1 && layers[0]) {
              return (
                <ListItem key={layers[0].code}>
                  <AdministrativeLayer key={layers[0].code} isGrouped={false} layer={layers[0]} />
                </ListItem>
              )
            }

            return null
          })}
        </ZonesList>
      ) : null}
    </>
  )
}

const ZonesList = styled.ul<{ $showZones: boolean; $zonesLength: number }>`
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-height: 50vh;
  height: ${p => (p.$showZones && p.$zonesLength ? 37 * p.$zonesLength : 0)}px;
  background: ${p => p.theme.color.white};
  transition: 0.5s all;
  overflow-y: auto;
`

const ListItem = styled.li`
  text-align: left;
  list-style-type: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  color: ${p => p.theme.color.gunMetal};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`
