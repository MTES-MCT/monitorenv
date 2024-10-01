import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const Container = styled.div`
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
  padding: 8px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0px;
  }
`
export const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  > span {
    margin-left: 8px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`
export const StyledButton = styled(IconButton)`
  padding: 0;
`
