import React from 'react'
import { IconButton, Table } from 'rsuite'
import styled from 'styled-components'
import GeoJSON from 'ol/format/GeoJSON'

import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map'
import { setFitToExtent } from '../../../domain/shared_slices/Map'

import { ReactComponent as LocalizeIconSVG } from '../../icons/Oeil_apercu_carte.svg'
import { useDispatch } from 'react-redux'

export const CellLocalizeMission = ({rowData, dataKey, ...props}) => {
  const dispatch = useDispatch()

  if (!rowData.geom) {
    return <CustomCell {...props}>
    -
  </CustomCell>
  }
  const handleZoomToMission = () => {

    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(rowData.geom)
    
    const extent = feature?.getGeometry()?.getExtent()
    dispatch(setFitToExtent({extent}))
  }
  return <CustomCell {...props}>
    <IconButton 
      size='sm' 
      icon={<LocalizeIcon className="rs-icon" />}
      onClick={handleZoomToMission}
    />
  </CustomCell>
}

const LocalizeIcon = styled(LocalizeIconSVG)`
  width: 20px;
`
const CustomCell = styled(Table.Cell)`
  .rs-table-cell-content {
    padding-top: 7px;
  }
`