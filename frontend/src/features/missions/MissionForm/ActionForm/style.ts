import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`

export const TitleWithIcon = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 8px;
  min-width: 0;
`

export const StyledDeleteIconButton = styled(IconButton)`
  > div > svg {
    color: ${p => p.theme.color.maximumRed};
  }
`
export const ActionFormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 48px;
`

export const ActionTitle = styled.h2`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: ${p => p.theme.color.charcoal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 8px;
`
export const ActionThemes = styled.div`
  color: ${p => p.theme.color.charcoal};
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;
`
export const StyledAuthorContainer = styled.div`
  display: flex;
  gap: 16px;
  .Field-TextInput {
    width: 120px;
  }
`
