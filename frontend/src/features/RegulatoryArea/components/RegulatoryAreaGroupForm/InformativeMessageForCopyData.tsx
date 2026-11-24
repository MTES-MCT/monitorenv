import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ConflictingRegulatoryAreas } from './ConflictingRegulatoryAreas'

import type { RegulatoryAreaGroupFields } from '@features/RegulatoryArea/hooks/usePropagation'
import type { RegulatoryArea } from '@features/RegulatoryArea/types'

type InformativeMessageForCopyDataProps = {
  field: RegulatoryAreaGroupFields
  onConfirm: () => void
  onReject: () => void
  regulatoryAreas: RegulatoryArea.RegulatoryAreaFromAPI[]
  text: React.ReactNode
  title: string
}
export function InformativeMessageForCopyData({
  field,
  onConfirm,
  onReject,
  regulatoryAreas,
  text,
  title
}: InformativeMessageForCopyDataProps) {
  return (
    <Wrapper>
      <div>
        <MessageTitle>{title} par défaut</MessageTitle>
        <p>
          {text}
          Le cas échéant, elles n’impacteront que que les futures zones réglementaires ajoutées au groupe.
        </p>
        {regulatoryAreas.length > 0 && (
          <ConflictingRegulatoryAreas field={field} regulatoryAreas={regulatoryAreas} title={title} />
        )}
      </div>
      <ButtonsWrapper>
        <Button accent={Accent.TERTIARY} className="_active" Icon={Icon.Confirm} onClick={onConfirm}>
          Oui
        </Button>
        <Button accent={Accent.TERTIARY} className="_active" Icon={Icon.Reject} onClick={onReject}>
          Non
        </Button>
      </ButtonsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.blueGray25};
  border: 1px solid ${p => p.theme.color.blueGray};
  display: flex;
  gap: 16px;
  padding: 16px;
`
const ButtonsWrapper = styled.div`
  align-self: flex-end;
  display: flex;
  margin-top: 16px;
  > button > * {
    color: ${p => p.theme.color.gunMetal};
  }
`
const MessageTitle = styled.p`
  color: #45688a;
  font-weight: bold;
  margin-bottom: 8px;
`
