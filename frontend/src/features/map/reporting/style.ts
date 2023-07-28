import { Button, IconButton } from '@mtes-mct/monitor-ui'
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
  padding: 16px 24px;
  gap: 8px;
`
export const StyledTitle = styled.div`
  display: flex;
  gap: 8px;
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

export const StyledCompanyContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
  > .Field-TextInput {
    flex: 1;
  }
`

export const StyledVesselContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
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

export const StyledLocalizationContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  > button {
    width: 175px;
  }
`
export const StyledThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`

export const StyledInfractionProven = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 4px;
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
export const StyledFooter = styled.div`
  background-color: ${p => p.theme.color.charcoal};
  height: 56px;
  color: ${p => p.theme.color.white};
  width: 500px;
  padding: 13px;
  display: flex;
  justify-content: space-between;
  gap: 4px;
`
export const StyledSubmitButton = styled(Button)`
  background-color: ${p => p.theme.color.white};
  padding: 4px 12px;
`
export const StyledArchivedButton = styled(Button)`
  border: 1px solid ${p => p.theme.color.white};
  padding: 3px 12px;
  margin-right: 8px;
`

export const StyledDeleteButton = styled(IconButton)`
  background-color: ${p => p.theme.color.white};
`
