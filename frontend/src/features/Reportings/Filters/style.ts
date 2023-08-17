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
export const StyledTagsContainer = styled.div`
  display: flex;
  flex-direction row;
  gap: 16px;
  align-items: baseline;
`
export const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`
export const StyledCutomPeriodLabel = styled.div`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-top: 16px;
`

export const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
