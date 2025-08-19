import { Button, MapMenuDialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const Italic = styled.div`
  font-style: italic;
`

export const Bold = styled.span`
  font-weight: 700;
`

export const StyledMapMenuDialogContainer = styled(MapMenuDialog.Container)`
  display: flex;
  margin-left: -6px;
  position: absolute;
  transform: translateX(-100%);
`

export const StyledMapMenuDialogTitle = styled(MapMenuDialog.Title)`
  font-weight: normal;
  margin: auto;
`

// TODO delete when Monitor-ui component have good padding
export const DialogButton = styled(Button)`
  padding: 4px 12px;
`

export const DialogSeparator = styled.div`
  height: 1px;
  border-top: 1px solid ${p => p.theme.color.gainsboro};
  margin-left: -12px;
  margin-right: -12px;
`

// Filters table
export const CustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const CustomPeriodLabel = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`
export const TagsContainer = styled.div<{ $withTopMargin?: boolean }>`
  align-items: end;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: ${p => (p.$withTopMargin ? '16px' : '0px')};
  max-width: 100%;
`

export const TransparentButton = styled.button.attrs(() => ({
  type: 'button'
}))`
  background: transparent;
  border: 1px solid transparent;

  &:hover {
    background: transparent;
    border: 1px solid transparent;
  }

  width: 100%;
  height: 100%;
  padding: 0;
`

export const StyledTransparentButton = styled(TransparentButton)`
  display: flex;
  align-items: center;
  width: 70%;
`

export const InlineTransparentButton = styled(TransparentButton)`
  display: flex;
  text-align: start;
  align-items: center;
`
