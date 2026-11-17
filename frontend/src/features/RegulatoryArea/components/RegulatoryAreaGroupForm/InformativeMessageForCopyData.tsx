import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type InformativeMessageForCopyDataProps = {
  onConfirm: () => void
  onReject: () => void
  text: React.ReactNode
  title: string
}
export function InformativeMessageForCopyData({
  onConfirm,
  onReject,
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
        <UnderlineText>{`Voir les ${title.toLowerCase()} ajoutées aux zones réglementaires actuelles`}</UnderlineText>
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

const UnderlineText = styled.p`
  text-decoration: underline;
`
