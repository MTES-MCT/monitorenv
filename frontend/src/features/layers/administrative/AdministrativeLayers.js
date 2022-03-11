import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import AdministrativeLayer from './AdministrativeLayer'
import AdministrativeLayerGroup from './AdministrativeLayerGroup'

import { toggleAdministrativeZones } from '../../../domain/shared_slices/LayerSidebar'

import {administrativeLayers} from '../../../domain/entities/administrativeLayers' 
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { COLORS } from '../../../constants/constants'

const AdministrativeLayers = () => {

  const dispatch = useDispatch()
  const showedLayers = useSelector(state => state.layer.showedLayers)
  const { administrativeZonesIsOpen } = useSelector(state => state.layerSidebar)

  const onSectionTitleClicked = () => {
    dispatch(toggleAdministrativeZones())
  }

  return (
    <>
      <SectionTitle
        onClick={onSectionTitleClicked}
        showZones={administrativeZonesIsOpen}
        data-cy={'administrative-zones-open'}
      >
        Zones administratives <ChevronIcon $isOpen={administrativeZonesIsOpen}/>
      </SectionTitle>
      {administrativeLayers && administrativeLayers.length
        ? <ZonesList showZones={administrativeZonesIsOpen} zonesLength={administrativeLayers.length}>
          {
            administrativeLayers.map((layers, index) => {
              if (layers.length === 1 && layers[0]) {
                return <ListItem key={layers[0].code}>
                  <AdministrativeLayer
                    key={layers[0].code}
                    isShownOnInit={showedLayers.some(layer_ => layer_.type === layers[0].code)}
                    layer={layers[0]}
                  />
                </ListItem>
              } else {
                return <ListItem key={layers[0].group.code}>
                  <AdministrativeLayerGroup
                    isLastItem={administrativeLayers.length === index + 1}
                    layers={layers}
                    showedLayers={showedLayers}
                  />
                </ListItem>
              }
            })
          }
        </ZonesList>
        : null}
    </>
  )
}

const SectionTitle = styled.div`
  height: 30px;
  padding-left: 20px;
  padding-top: 5px;
  font-size: 16px;
  cursor: pointer;
  background: ${COLORS.charcoal};
  color: ${COLORS.gainsboro};
  text-align: left;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => props.showZones ? '0' : '2px'};
  border-bottom-right-radius: ${props => props.showZones ? '0' : '2px'};
`

const ZonesList = styled.ul`
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  max-height: 70vh;
  height: ${props => props.showZones && props.zonesLength ? 36 * props.zonesLength : 0}px;
  background: ${COLORS.background};
  transition: 0.5s all;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`

const ListItem = styled.li`
  line-height: 18px;
  text-align: left;
  list-style-type: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};
`

export default AdministrativeLayers
