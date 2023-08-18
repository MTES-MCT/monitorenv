import { Select } from '@mtes-mct/monitor-ui'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

export const StyledStatusFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
`

export const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`
export const StyledCheckPicker = styled(CheckPicker)`
  .rs-picker-toggle-placeholder {
    font-size: 13px !important;
  }
`
export const StyledTagsContainer = styled.div<{ $withMargin: boolean }>`
  margin-top: ${p => (p.$withMargin ? '50px' : '0px')};
  display: flex;
  flex-direction row;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 8px 16px;
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
