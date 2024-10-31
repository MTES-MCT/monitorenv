import { TagsContainer } from '@components/style'
import { Select } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const StyledStatusFilter = styled.div<{ $withBottomMargin?: boolean }>`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: ${p => (p.$withBottomMargin ? '8px' : '0px')};
`
export const Separator = styled.div`
  border-right: ${p => `1px solid ${p.theme.color.slateGray}`};
  height: 50%;
  width: 2px;
`
export const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

export const StyledTagsContainer = styled(TagsContainer)`
  padding-right: 2%;
`

export const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
