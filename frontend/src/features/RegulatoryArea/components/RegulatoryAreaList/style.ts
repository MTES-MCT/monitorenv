import { LoadingIcon } from '@components/style'
import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const ControlPlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 32px;
`
export const GroupTitle = styled.div`
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
`
export const Title = styled.h2`
  font-size: 16px;
  padding: 12px;
`
export const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
export const StyledLoadingIcon = styled(LoadingIcon)`
  margin: 6px;
`
