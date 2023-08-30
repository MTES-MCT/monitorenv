import { Button, FormikTextInput, IconButton, MultiRadio, Tag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  > * {
    text-align: start;
  }
`
export const StyledForm = styled.div`
  padding: 32px;
  padding-right: calc(32px - var(--scrollbar-width));
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 108px);
  overflow-y: auto;
`

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${p => p.theme.color.charcoal};
  height: 52px;
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: 500;
  padding: 10px 24px;
  gap: 8px;
  flex: 1;
`
export const StyledTitle = styled.div`
  display: flex;
  gap: 8px;
`
export const StyledArchivedTag = styled(Tag)`
  margin-left: 16px;
`
export const StyledIconButton = styled(IconButton)`
  color: ${p => p.theme.color.white};
`
export const StyledChevronIcon = styled(IconButton)<{ $isOpen: boolean }>`
  transform: ${props => (!props.$isOpen ? 'rotate(0deg)' : 'rotate(-180deg)')};
  transition: all 0.5s;
`

export const StyledHeaderButtons = styled.div`
  display: flex;
  flex-direction: row;
  > button {
    color: ${p => p.theme.color.white};
  }
`

export const Separator = styled.div`
  margin-top: 8px;
  border: 1px solid ${p => p.theme.color.slateGray};
`
export const StyledInlineContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 32px;
  > div {
    flex: 1;
  }
`

const StyledTargetDetailsContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
`
export const StyledCompanyContainer = styled(StyledTargetDetailsContainer)`
  > .Field-TextInput {
    flex: 1;
  }
`

export const StyledVesselContainer = styled(StyledTargetDetailsContainer)`
  flex-direction: column;
  align-self: stretch;
`

export const StyledEmptyTarget = styled.div`
  height: 180px;
  background-color: ${p => p.theme.color.cultured};
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    color: ${p => p.theme.color.lightGray};
    font-style: italic;
  }
`

export const StyledVesselForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  > .Field-TextInput,
  .Field-NumberInput {
    flex: 1;
  }
`

export const StyledPositionContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`
export const ReportTypeMultiRadio = styled(MultiRadio)`
  > div > div > div:first-child label::after {
    color: ${({ theme }) => theme.color.maximumRed};
    content: ' ●';
  }
  > div > div > div:last-child label::after {
    color: ${({ theme }) => theme.color.blueGray[100]};
    content: ' ●';
  }
`

export const StyledThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`
export const StyledToggle = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  > .rs-toggle-checked .rs-toggle-presentation {
    background-color: ${p => p.theme.color.gunMetal};
  }
`
export const StyledFormikTextInput = styled(FormikTextInput)`
  width: 120px;
`
export const StyledFooter = styled.div<{ $justify?: string | undefined }>`
  background-color: ${p => p.theme.color.charcoal};
  height: 56px;
  color: ${p => p.theme.color.white};
  width: 500px;
  padding: 13px;
  display: flex;
  justify-content: ${p => p.$justify ?? 'space-between'};
  gap: 4px;
`
export const StyledSubmitButton = styled(Button)`
  background-color: ${p => p.theme.color.white};
  padding: 4px 12px;
`
export const StyledButton = styled(Button)`
  border: 1px solid ${p => p.theme.color.white};
  padding: 3px 12px;
  margin-right: 8px;
`

export const StyledDeleteButton = styled(IconButton)`
  background-color: ${p => p.theme.color.white};
`
