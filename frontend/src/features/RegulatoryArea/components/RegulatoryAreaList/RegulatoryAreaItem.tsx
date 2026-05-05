import { StyledTransparentButton } from '@components/style'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { regulatoryAreaTableActions } from './slice'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { Coordinate } from 'ol/coordinate'

export function RegulatoryAreaItem({ regulatoryArea }: { regulatoryArea: RegulatoryArea.RegulatoryAreaWithBbox }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)
  const layerTitle = getRegulatoryAreaTitle(regulatoryArea.polyName, regulatoryArea.resume) ?? 'AUCUN NOM'

  const bbox = useMemo(() => {
    if (!regulatoryArea.geom) {
      return undefined
    }

    return boundingExtent(regulatoryArea.geom?.coordinates.flat().flat() as Coordinate[])
  }, [regulatoryArea.geom])

  const openMetadata = event => {
    event.stopPropagation()
    dispatch(
      regulatoryAreaTableActions.setOpenRegulatoryAreaId(
        openedRegulatoryAreaId === regulatoryArea.id ? undefined : regulatoryArea.id
      )
    )
    if (!bbox) {
      return
    }

    const extent = transformExtent(
      bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  const onEdit = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/${regulatoryArea.id}`)
    if (!bbox) {
      return
    }
    const extent = transformExtent(
      bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
    dispatch(setFitToExtent(extent))
  }

  return (
    <LayerSelector.Layer
      $isNew={regulatoryArea.isNew}
      $isRecentlyUpdated={regulatoryArea.isUpdatedRecently}
      $metadataIsShown={openedRegulatoryAreaId === regulatoryArea.id}
    >
      <StyledTransparentButton $width="70%" onClick={openMetadata}>
        <LayerLegend
          layerType={MonitorEnvLayers.REGULATORY_ENV}
          legendKey={layerTitle}
          plan={regulatoryArea.plan}
          type={regulatoryArea.type}
        />
        <LayerSelector.Name title={layerTitle}>{layerTitle}</LayerSelector.Name>
      </StyledTransparentButton>
      <LayerSelector.IconGroup>
        <IconButton
          accent={Accent.TERTIARY}
          color={THEME.color.slateGray}
          Icon={Icon.Edit}
          onClick={onEdit}
          title="Editer la réglementation"
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
