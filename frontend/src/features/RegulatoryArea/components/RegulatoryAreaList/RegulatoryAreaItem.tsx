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
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { useNavigate } from 'react-router'

import { regulatoryAreaTableActions } from './slice'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function RegulatoryAreaItem({ regulatoryArea }: { regulatoryArea: RegulatoryArea.RegulatoryAreaWithBbox }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)
  const layerTitle = getRegulatoryAreaTitle(regulatoryArea.polyName, regulatoryArea.resume) ?? 'AUCUN NOM'

  const openMetadata = event => {
    event.stopPropagation()
    dispatch(
      regulatoryAreaTableActions.setOpenRegulatoryAreaId(
        openedRegulatoryAreaId === regulatoryArea.id ? undefined : regulatoryArea.id
      )
    )
    if (!regulatoryArea?.bbox) {
      return
    }

    const extent = transformExtent(
      regulatoryArea?.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  const onEdit = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/${regulatoryArea.id}`)
    const extent = transformExtent(
      regulatoryArea?.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
    dispatch(setFitToExtent(extent))
  }

  return (
    <LayerSelector.Layer $metadataIsShown={openedRegulatoryAreaId === regulatoryArea.id}>
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
