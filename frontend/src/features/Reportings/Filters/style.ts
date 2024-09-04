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

export const StyledTagsContainer = styled.div<{ $withTopMargin: boolean }>`
  align-items: end;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: ${p => (p.$withTopMargin ? '16px' : '0px')};
  max-width: 100%;
  padding-right: 2%;
`
export const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
export const StyledCutomPeriodLabel = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`

export const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
