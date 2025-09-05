import { Button } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

// FORM
export const Header = styled.header<{ $isEditing: boolean }>`
  align-items: center;
  background-color: ${p => (p.$isEditing ? p.theme.color.gainsboro : p.theme.color.blueGray25)};
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 9px 16px 10px 16px;
`
export const Title = styled.span`
  font-size: 15px;
  color: ${p => p.theme.color.gunMetal};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
export const SubHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`
export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  min-width: 0;
`

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
export const SubFormTitle = styled.h2`
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
  &:hover &:not(disabled) {
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

// PANEL
export const PanelContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 1px 3px #707785b3;
  max-height: calc(100vh - 330px);
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const PanelBody = styled.div`
  overflow-y: auto;
`

export const PanelSubPart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

export const PanelImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  padding: 16px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  > button > img {
    object-fit: cover;
  }
`

export const PanelItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const PanelInlineItem = styled(PanelItem)`
  flex-direction: row;
`

export const PanelInlineItemLabel = styled.span<{ $isInline?: boolean }>`
  color: ${p => p.theme.color.slateGray};
  margin-bottom: 4px;
  min-width: 76px;
  width: ${p => (p.$isInline ? '76px' : 'auto')};
`

export const PanelInlineItemValue = styled.span<{ $maxLine?: number }>`
  color: ${p => p.theme.color.gunMetal};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${p => p.$maxLine ?? '1'};
  overflow: hidden;
  white-space: pre-wrap;
`

export const StyledPanelInlineItemValue = styled(PanelInlineItemValue)`
  margin-bottom: 4px;
`

export const PanelDateItem = styled.div`
  display: flex;
  flex-direction: column;
`
export const PanelLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`

export const PanelLinkText = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: 500;
`

export const PanelLinkUrl = styled.a`
  color: #295edb;
`
export const PanelInternText = styled.span`
  color: ${p => p.theme.color.maximumRed};
  margin-bottom: 8px;
`
