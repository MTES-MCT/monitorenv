import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { ConflictingRegulatoryAreas } from './ConflictingRegulatoryAreas'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { RegulatoryAreaGroupFields } from '@features/RegulatoryArea/useCases/usePropagation'

type InformativeMessageForCopyDataProps = {
  field: RegulatoryAreaGroupFields
  onConfirm: () => void
  onReject: () => void
  /** Regulatory areas whose current value would be overwritten */
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
  const [isListOpen, setIsListOpen] = useState(false)

  return (
    <Wrapper>
      <div>
        <MessageTitle>{title} par défaut</MessageTitle>
        <p>
          {text}
          Le cas échéant, elles n’impacteront que que les futures zones réglementaires ajoutées au groupe.
        </p>
        <UnderlineText aria-expanded={isListOpen} onClick={() => setIsListOpen(isOpen => !isOpen)} type="button">
          {`${isListOpen ? 'Masquer' : 'Voir'} les ${title.toLowerCase()} ajoutées aux zones réglementaires actuelles (${
            regulatoryAreas.length
          })`}
        </UnderlineText>
        {isListOpen && <ConflictingRegulatoryAreas field={field} regulatoryAreas={regulatoryAreas} />}
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

const UnderlineText = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  text-align: left;
  text-decoration: underline;
`
