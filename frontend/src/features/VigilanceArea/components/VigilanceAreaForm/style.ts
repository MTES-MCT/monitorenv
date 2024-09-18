import { Button } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const DeleteButton = styled(Button)`
  > span {
    color: ${p => p.theme.color.maximumRed};
  }
`
export const FooterContainer = styled.footer`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  justify-content: space-between;
  padding: 12px 8px;
  height: 48px;
`
export const FooterRightButtons = styled.div`
  display: flex;
  gap: 8px;
`
export const SubFormHeader = styled.header`
  align-items: center;
  background: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding: 9px 16px 10px 16px;
`
export const SubFormTitle = styled.h1`
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`

export const SubFormHelpText = styled.span`
  font-style: italic;
  color: ${p => p.theme.color.gunMetal};
`

export const SubFormBody = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 16px 16px 16px;
`
export const ValidateButton = styled(Button)`
  align-self: flex-end;
  background: ${p => p.theme.color.mediumSeaGreen};
  border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  color: ${p => p.theme.color.white};
  &:hover {
    background: ${p => p.theme.color.mediumSeaGreen};
    border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  }
`
export const StyledImageButton = styled.button`
  cursor: zoom-in;
  background: none;
  border: none;
  padding: 0px;
`
