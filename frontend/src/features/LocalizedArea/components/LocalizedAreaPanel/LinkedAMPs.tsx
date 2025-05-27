import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from 'domain/shared_slices/Amp'
import styled from 'styled-components'

import { SubTitle } from './style'

import type { AMP } from 'domain/entities/AMPs'

export function LinkedAMPs({ amps }: { amps: AMP[] }) {
  const dispatch = useAppDispatch()
  const ampIdsSavedInMyAmp = useAppSelector(state => state.amp.selectedAmpLayerIds)

  const addToMyAMP = (e, ampId) => {
    e.stopPropagation()

    if (ampIdsSavedInMyAmp.includes(ampId)) {
      dispatch(removeAmpZonesFromMyLayers([ampId]))
    } else {
      dispatch(addAmpZonesToMyLayers([ampId]))
    }
  }

  return (
    <>
      <SubTitle>AMP en lien</SubTitle>
      {amps.map(amp => (
        <AMPItem key={amp.id}>
          <AMPNameContainer title={`${amp.type} / ${amp.name}`}>
            <LayerLegend
              key={amp.id}
              layerType={MonitorEnvLayers.AMP}
              legendKey={amp?.name ?? 'aucun'}
              type={amp?.type ?? 'aucun'}
            />
            <AmpName> {amp?.name}</AmpName>
            &nbsp;/&nbsp;<AmpType>{amp?.type} </AmpType>
          </AMPNameContainer>
          <StyledIconButton
            accent={Accent.TERTIARY}
            color={ampIdsSavedInMyAmp.includes(amp.id) ? THEME.color.blueGray : THEME.color.gunMetal}
            Icon={ampIdsSavedInMyAmp.includes(amp.id) ? Icon.PinFilled : Icon.Pin}
            onClick={e => addToMyAMP(e, amp.id)}
            title="Ajouter la zone à Mes AMP"
          />
        </AMPItem>
      ))}
    </>
  )
}

const AMPItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 16px 16px 16px;
`

const StyledIconButton = styled(IconButton)`
  padding: 0px;
`
const AMPNameContainer = styled.div`
  display: flex;
  color: ${p => p.theme.color.gunMetal};
  align-items: center;
  overflow: hidden;
  padding-top: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AmpType = styled.span`
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AmpName = styled.span`
  font-weight: 500;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
