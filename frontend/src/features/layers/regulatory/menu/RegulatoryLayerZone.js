import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import Projection from 'ol/proj/Projection';
import {transformExtent} from 'ol/proj';

import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { getRegulatoryEnvColorWithAlpha } from '../../../../layers/styles/administrativeAndRegulatoryLayers.style'
import { REGPaperDarkIcon, REGPaperIcon } from '../../../commonStyles/icons/REGPaperIcon.style'
import { ShowIcon } from '../../../commonStyles/icons/ShowIcon.style'
import { HideIcon } from '../../../commonStyles/icons/HideIcon.style'
import { CloseIcon } from "../../../commonStyles/icons/CloseIcon.style";
import { COLORS } from '../../../../constants/constants'
import {hideRegulatoryLayer, removeRegulatoryZonesFromMyLayers, showRegulatoryLayer} from "../../../../domain/shared_slices/Regulatory";
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map';

const RegulatoryLayerZone = ({regulatoryZone}) => {
  const dispatch = useDispatch()
  const { showedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const { regulatoryZonesChecked } = useSelector(state => state.regulatoryLayerSearch)
  const regulatoryZoneIsShowed = showedRegulatoryLayerIds.includes(regulatoryZone.id)
  const isZoneSelected = regulatoryZonesChecked.includes(regulatoryZone.id)
  const metadataIsShown = false



  const toggleLayerDisplay = () => regulatoryZoneIsShowed ? dispatch(hideRegulatoryLayer(regulatoryZone.id)) : dispatch(showRegulatoryLayer(regulatoryZone.id))
  const handleRemoveZone = () =>  dispatch(removeRegulatoryZonesFromMyLayers([regulatoryZone.id]))
  const zoomToLayerExtent = () => {
    const extent = transformExtent(regulatoryZone.bbox, new Projection({code: WSG84_PROJECTION}), new Projection({code: OPENLAYERS_PROJECTION}) )
    !regulatoryZoneIsShowed && dispatch(showRegulatoryLayer(regulatoryZone.id))
    dispatch(setFitToExtent({extent}))
  }

  const displayedName = regulatoryZone?.properties?.entity_name.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  const toggleRegulatoryZoneMetadata = () => console.log('togglemetadata')
  return (
    <Zone $selected={isZoneSelected}>
      <Rectangle onClick={zoomToLayerExtent} $vectorLayerColor={getRegulatoryEnvColorWithAlpha(regulatoryZone?.doc?.properties?.thematique)}/>
      <Name onClick={toggleLayerDisplay} title={displayedName} >
        {displayedName}
      </Name>
        <Icons>
          {
            metadataIsShown
              ? <CustomREGPaperDarkIcon title="Fermer la réglementation" onClick={toggleRegulatoryZoneMetadata}/>
              : <CustomREGPaperIcon title="Afficher la réglementation" onClick={toggleRegulatoryZoneMetadata}/>
          }
          {
            regulatoryZoneIsShowed
              ? <ShowIcon
                  data-cy={'regulatory-layers-my-zones-zone-hide'}
                  title="Cacher la zone"
                  onClick={toggleLayerDisplay}
              />
              : <HideIcon
                  data-cy={'regulatory-layers-my-zones-zone-show'}
                  title="Afficher la zone"
                  onClick={toggleLayerDisplay}
              />
          }
          <CloseIcon 
            title="Supprimer la zone de ma sélection"
            data-cy={'regulatory-layers-my-zones-zone-delete'}
            onClick={handleRemoveZone}/>
        </Icons>
    </Zone>
  )
}

const Name = styled.span`
  width: 280px;
  text-overflow: ellipsis;
  overflow-x: hidden !important;
  font-size: inherit;
  margin-top: 5px;
`

const Rectangle = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => props.$vectorLayerColor || COLORS.gray};
  border: 1px solid ${COLORS.grayDarkerTwo};
  display: inline-block;
  margin-right: 10px;
  margin-top: 9px;
  flex-shrink: 0;
`

const Zone = styled.span`
  user-select: none;
  display: flex;
  font-size: 13px;
  padding-left: 20px;
  background: ${props => props.$selected ? COLORS.gray : COLORS.background};
  color: ${COLORS.gunMetal};
  padding-top: 1px;
  padding-bottom: 5px;
  
  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

const CustomPaperStyle = css`
  margin-right: -2px;
  padding-top: 7px;
  width: 21px;
  height: 23px
`

const CustomREGPaperIcon = styled(REGPaperIcon)`
  ${CustomPaperStyle}
`
const CustomREGPaperDarkIcon = styled(REGPaperDarkIcon)`
  ${CustomPaperStyle}
`

const Icons = styled.span`
  float: right;
  display: flex;
  justify-content: flex-end;
  flex: 1;
`

export default RegulatoryLayerZone
