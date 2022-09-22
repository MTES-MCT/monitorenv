import GeoJSON from 'ol/format/GeoJSON'
import React from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Table } from 'rsuite'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { ReactComponent as LocalizeIconSVG } from '../../../uiMonitor/icons/Oeil_apercu_carte.svg'

export function CellLocalizeMission({ dataKey, rowData, ...props }) {
  const dispatch = useDispatch()

  if (!rowData.geom) {
    return <CustomCell {...props}>-</CustomCell>
  }
  const handleZoomToMission = () => {
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(rowData.geom)

    const extent = feature?.getGeometry()?.getExtent()
    dispatch(setFitToExtent({ extent }))
  }

  return (
    <CustomCell {...props}>
      <IconButton icon={<LocalizeIcon className="rs-icon" />} onClick={handleZoomToMission} size="sm" />
    </CustomCell>
  )
}

const LocalizeIcon = styled(LocalizeIconSVG)`
  width: 20px;
`
const CustomCell = styled(Table.Cell)`
  .rs-table-cell-content {
    padding-top: 7px;
  }
`
