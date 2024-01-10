import { Select } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const StyledStatusFilter = styled.div<{ $withBottomMargin?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
  margin-bottom: ${p => (p.$withBottomMargin ? '8px' : '0px')};
`
export const Separator = styled.div`
  width: 2px;
  height: 50%;
  border-right: ${p => `1px solid ${p.theme.color.slateGray}`};
`
export const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

export const StyledTagsContainer = styled.div<{ $withTopMargin: boolean }>`
  margin-top: ${p => (p.$withTopMargin ? '16px' : '0px')};
  display: flex;
  flex-direction: row;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
`
export const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
export const StyledCutomPeriodLabel = styled.div`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
`

export const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
