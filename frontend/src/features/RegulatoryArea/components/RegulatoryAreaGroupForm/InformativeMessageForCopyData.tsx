import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function InformativeMessageForCopyData({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <div>{children}</div>
      <ButtonsWrapper>
        <Button accent={Accent.TERTIARY} className="_active" Icon={Icon.Confirm}>
          Oui
        </Button>
        <Button accent={Accent.TERTIARY} className="_active" Icon={Icon.Reject}>
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
