import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { Tooltip } from '@components/Tooltip'
import { PanelSource } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelSource'
import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import {
  PanelInlineItem,
  PanelInlineItemLabel,
  PanelInlineItemValue,
  PanelInternText,
  PanelItem,
  PanelSubPart
} from '../style'

export function PanelInternalCACEMSection({
  createdBy,
  sources = []
}: {
  createdBy: string | undefined
  sources?: VigilanceArea.VigilanceAreaSource[]
}) {
  const controlUnitIds = sources.flatMap(
    source => source.controlUnitContacts?.flatMap(contact => contact.controlUnitId) ?? []
  )
  const controlUnits = useAppSelector(state => getControlUnitsByIds(state, controlUnitIds))
  const getControlUnitName = (controlUnitId: number) => {
    const unit = controlUnits.find(controlUnit => controlUnit.id === controlUnitId)

    return `${unit?.name} (${unit?.administration?.name})`
  }

  return (
    <PanelSubPart data-cy="vigilance-area-panel-source">
      <Wrapper>
        <PanelInternText>Section interne CACEM</PanelInternText>
        <Tooltip color={THEME.color.maximumRed}>
          Même si la visibilité de la zone de vigilance est publique, les infos de cette section &quot;Interne
          CACEM&quot; ne seront pas visibles sur la version de MonitorEnv utilisée hors du centre.
        </Tooltip>
      </Wrapper>
      <PanelInlineItem>
        <PanelInlineItemLabel>Créé par</PanelInlineItemLabel>
        <PanelInlineItemValue>{createdBy ?? EMPTY_VALUE}</PanelInlineItemValue>
      </PanelInlineItem>
      {sources.length > 0 && (
        <PanelInlineItem>
          <PanelInlineItemLabel>Sources</PanelInlineItemLabel>
          <PanelItem>
            {sources.map(source =>
              (source.controlUnitContacts?.length ?? 0) > 0 ? (
                source.controlUnitContacts?.map(contact => (
                  <PanelSource
                    key={contact.id}
                    email={contact.email}
                    name={getControlUnitName(contact.controlUnitId)}
                    phone={contact.phone}
                  />
                ))
              ) : (
                <PanelSource key={source.id} email={source.email} name={source.name} phone={source.phone} />
              )
            )}
          </PanelItem>
        </PanelInlineItem>
      )}
    </PanelSubPart>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
