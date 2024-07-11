import {
  closeMetadataPanel,
  getMetadataIsOpenForAMPLayerId,
  openAMPMetadataPanel
} from '@features/layersSelector/metadataPanel/slice'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { addAmpZonesToMyLayers, hideAmpLayer, removeAmpZonesFromMyLayers, showAmpLayer } from 'domain/shared_slices/Amp'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMP } from 'domain/entities/AMPs'

type AMPItemProps = {
  amp: AMP | undefined
  isReadOnly: boolean
}

export function AMPItem({ amp, isReadOnly }: AMPItemProps) {
  const dispatch = useAppDispatch()

  const {
    setFieldValue,
    values: { linkedAMPs }
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const ampId = amp?.id
  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const ampIdsToBeDisplayed = useAppSelector(state => state.vigilanceArea.ampIdsToBeDisplayed)
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)

  const metadataIsShown = useAppSelector(state => (ampId ? getMetadataIsOpenForAMPLayerId(state, ampId) : undefined))

  const isZoneSelected = !!(ampId && selectedAmpLayerIds.includes(ampId))
  const isLayerVisible = !!(ampId && ampIdsToBeDisplayed?.includes(ampId))
  const pinnedAMPIsShowed = !!(ampId && showedAmpLayerIds.includes(ampId))

  const deleteAMP = e => {
    e.stopPropagation()

    if (!ampId) {
      return
    }
    dispatch(vigilanceAreaActions.deleteAMPsFromVigilanceArea(ampId))
    setFieldValue(
      'linkedAMPs',
      linkedAMPs.filter(id => id !== ampId)
    )
  }

  const addToMyAMP = e => {
    e.stopPropagation()
    if (!ampId) {
      return
    }
    if (isZoneSelected) {
      dispatch(removeAmpZonesFromMyLayers([ampId]))
    } else {
      dispatch(addAmpZonesToMyLayers([ampId]))
    }
  }

  const displayAMP = e => {
    e.stopPropagation()

    if (!ampId) {
      return
    }

    if (!selectedAmpLayerIds.includes(ampId)) {
      if (isLayerVisible) {
        dispatch(vigilanceAreaActions.removeAMPIdsToBeDisplayed(ampId))
      } else {
        dispatch(vigilanceAreaActions.addAMPIdsToBeDisplayed(ampId))
      }

      return
    }

    if (isLayerVisible || pinnedAMPIsShowed) {
      dispatch(vigilanceAreaActions.removeAMPIdsToBeDisplayed(ampId))
      dispatch(hideAmpLayer(ampId))
    } else {
      dispatch(vigilanceAreaActions.addAMPIdsToBeDisplayed(ampId))
      dispatch(showAmpLayer(ampId))
    }
  }

  const toggleRegulatoryZoneMetadata = id => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openAMPMetadataPanel(id))
      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }
    }
  }

  return (
    <AMPContainer $isReadOnly={isReadOnly} data-cy="amp-item" onClick={() => toggleRegulatoryZoneMetadata(ampId)}>
      <AMPName>
        <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={amp?.name ?? 'aucun'} type={amp?.type ?? 'aucun'} />
        <span title={amp?.name}>{amp?.name}</span>
      </AMPName>
      {isReadOnly ? (
        <ButtonsContainer>
          <StyledIconButton
            accent={Accent.TERTIARY}
            color={isLayerVisible || pinnedAMPIsShowed ? THEME.color.charcoal : THEME.color.lightGray}
            Icon={Icon.Display}
            onClick={displayAMP}
            title={isLayerVisible ? 'Cacher la zone' : 'Afficher la zone'}
          />
          <StyledIconButton
            accent={Accent.TERTIARY}
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={addToMyAMP}
            title="Ajouter la zone à Mes AMP"
          />
        </ButtonsContainer>
      ) : (
        <IconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Close}
          onClick={deleteAMP}
          size={Size.SMALL}
          title={`vigilance-area-delete-amp-${ampId}`}
        />
      )}
    </AMPContainer>
  )
}

const AMPContainer = styled.div<{ $isReadOnly: boolean }>`
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;

  ${p =>
    p.$isReadOnly &&
    `
        &:last-child {
          border-bottom: none;
          padding-bottom: 0px;
           }
      `}
`
const AMPName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`
const StyledIconButton = styled(IconButton)`
  padding: 0px;
`
