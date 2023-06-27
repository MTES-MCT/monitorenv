import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { administrativeLayers } from '../../../domain/entities/administrativeLayers'
import { toggleAdministrativeZones } from '../../../domain/shared_slices/LayerSidebar'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerType } from '../utils/LayerType.style'
import { AdministrativeLayer } from './AdministrativeLayer'

export function AdministrativeLayers() {
  const dispatch = useDispatch()
  const { administrativeZonesIsOpen } = useAppSelector(state => state.layerSidebar)

  const onSectionTitleClicked = () => {
    dispatch(toggleAdministrativeZones())
  }

  return (
    <>
      <LayerType.Wrapper
        $isExpanded={administrativeZonesIsOpen}
        data-cy="administrative-zones-open"
        onClick={onSectionTitleClicked}
      >
        <LayerType.Title>Zones administratives</LayerType.Title>
        <ChevronIcon $isOpen={administrativeZonesIsOpen} $right />
      </LayerType.Wrapper>
      {administrativeLayers && administrativeLayers.length ? (
        <ZonesList showZones={administrativeZonesIsOpen} zonesLength={administrativeLayers.length}>
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

const ZonesList = styled.ul<{ showZones: boolean; zonesLength: number }>`
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-height: 70vh;
  height: ${p => (p.showZones && p.zonesLength ? 37 * p.zonesLength : 0)}px;
  background: ${p => p.theme.color.white};
  transition: 0.5s all;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`

const ListItem = styled.li`
  min-height: 36px;
  line-height: 18px;
  text-align: left;
  list-style-type: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  color: ${p => p.theme.color.gunMetal};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`
