import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'


import { showRegulatoryLayer, hideRegulatoryLayer} from "../../../domain/shared_slices/Regulatory";
import showRegulatoryZoneMetadata from '../../../domain/use_cases/showRegulatoryZoneMetadata'
import closeRegulatoryZoneMetadata from '../../../domain/use_cases/closeRegulatoryZoneMetadata'
import zoomInLayer from '../../../domain/use_cases/zoomInLayer'

import { CloseIcon } from '../../commonStyles/icons/CloseIcon.style'
import { ShowIcon } from '../../commonStyles/icons/ShowIcon.style'
import { HideIcon } from '../../commonStyles/icons/HideIcon.style'
import { REGPaperDarkIcon, REGPaperIcon } from '../../commonStyles/icons/REGPaperIcon.style'
import { COLORS } from '../../../constants/constants'

const RegulatoryLayerZone = ({
                               regulatoryZone,
                               vectorLayerStyle,
                               isLast,
                             }) => {
  const dispatch = useDispatch()
  const { showedRegulatoryLayerIds } = useSelector(state => state.regulatory)

  const metadataIsShown = false
  const [isOver, setIsOver] = useState(false)

  const toggleMetadata = () => {
    if (!metadataIsShown) {
      dispatch(showRegulatoryZoneMetadata(regulatoryZone.id))
    } else {
      dispatch(closeRegulatoryZoneMetadata())
    }
  }
  const regulatoryZoneIsShowed = showedRegulatoryLayerIds.includes(regulatoryZone.id)
  const onMouseOver = () => !isOver && setIsOver(true)
  const onMouseOut = () => isOver && setIsOver(false)
  const toggleLayerDisplay = () => regulatoryZoneIsShowed ? dispatch(hideRegulatoryLayer(regulatoryZone.id)) : dispatch(showRegulatoryLayer(regulatoryZone.id))
  const zoomToLayerExtent = () => dispatch(zoomInLayer({ topicAndZone: regulatoryZone }))
  const handleRemoveLayer = () => console.log("remove")
  const displayedName = regulatoryZone?.properties?.entity_name.replace(/[_]/g, ' ') || 'AUNCUN NOM'
  return (
    <Zone
      data-cy="regulatory-layer-zone"
      isLast={isLast}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}>
      <Rectangle onClick={zoomToLayerExtent} vectorLayerStyle={vectorLayerStyle}/>
      <ZoneText
        data-cy={'regulatory-layers-my-zones-zone'}
        title={ displayedName }
        onClick={toggleLayerDisplay}
      >
        { displayedName }
      </ZoneText>
      <Icons>
        {
          metadataIsShown
            ? <REGPaperDarkIcon
              title="Fermer la réglementation"
              onClick={toggleMetadata}
            />
            : <REGPaperIcon
              data-cy={'regulatory-layers-show-metadata'}
              title="Afficher la réglementation"
              onClick={toggleMetadata}
            />
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
          onClick={handleRemoveLayer}
        />
      </Icons>
    </Zone>
  )
}

const Rectangle = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => props.vectorLayerStyle && props.vectorLayerStyle.getFill() ? props.vectorLayerStyle.getFill().getColor() : COLORS.gray};
  border: 1px solid ${props => props.vectorLayerStyle && props.vectorLayerStyle.getStroke() ? props.vectorLayerStyle.getStroke().getColor() : COLORS.grayDarkerTwo};
  display: inline-block;
  margin-right: 10px;
  margin-left: 2px;
  margin-top: 7px;
  cursor: zoom-in;
`

const Icons = styled.span`
  float: right;
  display: flex;
  justify-content: flex-end;
  flex: 1;
`

const Zone = styled.span`
  display: flex;
  justify-content: flex-start;
  line-height: 1.9em;
  padding-left: 31px;
  padding-top: 4px;
  padding-bottom: 4px;
  user-select: none;
  font-size: 13px;
  font-weight: 300;
  ${props => props.isLast
  ? `border-bottom: 1px solid ${COLORS.lightGray}; height: 27px;`
  : null}

  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

const ZoneText = styled.span`
  width: 63%;
  display: inline-block;
  text-overflow: ellipsis;
  overflow-x: hidden !important;
  vertical-align: bottom;
  padding-bottom: 3px;
  padding-left: 0;
  margin-top: 5px;
`

export default RegulatoryLayerZone
