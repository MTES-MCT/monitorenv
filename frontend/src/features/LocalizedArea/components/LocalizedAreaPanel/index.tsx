import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { getTitle } from 'domain/entities/layers/utils'
import styled from 'styled-components'

import { LinkedAMPs } from './LinkedAMPs'
import { LinkedControlUnits } from './LinkedControlUnits'

import type { LocalizedArea } from '../../types'

export function LocalizedAreaPanel({ localizedArea }: { localizedArea?: LocalizedArea.LocalizedArea }) {
  const dispatch = useAppDispatch()
  const { metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)

  const { amps } = useGetAMPsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      amps: Object.values(data?.entities ?? []).filter(amp => localizedArea?.ampIds?.includes(amp.id))
    })
  })
  const { controlUnits } = useGetControlUnitsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      controlUnits: data?.filter(controlUnit => localizedArea?.controlUnitIds?.includes(controlUnit.id))
    })
  })

  const onCloseIconClicked = () => {
    dispatch(closeMetadataPanel())
  }

  if (!localizedArea) {
    return null
  }

  return (
    <Wrapper $regulatoryMetadataPanelIsOpen={metadataPanelIsOpen}>
      <Header data-cy="regulatory-metadata-header">
        <LayerLegend
          layerType={MonitorEnvLayers.LOCALIZED_AREAS}
          legendKey={localizedArea.name}
          type={localizedArea.groupName}
        />
        <Name title={getTitle(localizedArea?.groupName)}>{getTitle(localizedArea?.groupName)}</Name>
        <IconButton
          accent={Accent.TERTIARY}
          data-cy="regulatory-layers-metadata-close"
          Icon={Icon.Close}
          onClick={onCloseIconClicked}
        />
      </Header>
      <Content>
        <LinkedAMPs amps={amps} />
        <Separator />
        <LinkedControlUnits controlUnits={controlUnits ?? []} />
      </Content>
    </Wrapper>
  )
}
const Wrapper = styled.div<{ $regulatoryMetadataPanelIsOpen: boolean }>`
  border-radius: 2px;
  width: 400px;
  display: block;
  color: ${p => p.theme.color.charcoal};
  opacity: ${p => (p.$regulatoryMetadataPanelIsOpen ? 1 : 0)};
  padding: 0;
  transition: all 0.5s;
`

const Name = styled.span`
  flex: 1;
  line-height: initial;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  margin-left: 5px;
  margin-right: 5px;
`

const Header = styled.div`
  color: ${p => p.theme.color.gunMetal};
  margin-left: 6px;
  text-align: left;
  height: 40px;
  display: flex;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  padding: 4px;
`

const Content = styled.div`
  border-radius: 2px;
  color: ${p => p.theme.color.lightGray};
  background: ${p => p.theme.color.white};
  overflow-y: auto;
  max-height: 72vh;
`

const Separator = styled.div`
  height: 1px;
  border-top: 1px solid ${p => p.theme.color.gainsboro};
`
