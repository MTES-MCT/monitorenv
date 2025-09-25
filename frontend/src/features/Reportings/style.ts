import { Italic } from '@components/style'
import { Button, FormikTextInput, IconButton, MultiRadio, Tag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingContext, VisibilityState } from '../../domain/shared_slices/Global'

export const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  > * {
    text-align: start;
  }
`
export const StyledForm = styled.div<{ $totalReducedReportings: number }>`
  padding: 16px 32px 32px 31px;
  padding-right: calc(32px - var(--scrollbar-width||0px));
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 146px - ${p => p.$totalReducedReportings * 52}px);
  overflow-y: auto;
`

export const ReportingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${p => p.theme.color.charcoal};
  height: 52px;
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: 500;
  padding: 10px 16px;
  gap: 8px;
  flex: 1;
`

export const ReportingTitle = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SaveBanner = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  color: ${p => p.theme.color.slateGray};
  display: flex;
  height: 38px;
  justify-content: space-between;
  padding: 10px 16px;
  z-index: 1;
`
export const StyledItalic = styled(Italic)`
  font-size: 13px;
`
export const ReportingInfosContainer = styled.div`
  display: flex;
  gap: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ReportingInfos = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
export const StyledArchivedTag = styled(Tag)`
  margin-left: 16px;
`
export const StyledIconButton = styled(IconButton)`
  color: ${p => p.theme.color.white};
`
export const ReportingChevronIcon = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${p => (!p.$isExpanded ? 'rotate(0deg)' : 'rotate(-180deg)')};
  transition: all 0.5s;
`

export const ReportingHeaderButtons = styled.div`
  display: flex;
  flex-direction: row;

  > button {
    color: ${p => p.theme.color.white};
  }
`

export const Separator = styled.div`
  margin-top: 8px;
  border: 1px solid ${p => p.theme.color.slateGray};
`
export const StyledInlineContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 32px;

  > div {
    flex: 1;
  }
`

const StyledTargetDetailsContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
`
export const StyledCompanyContainer = styled(StyledTargetDetailsContainer)`
  > .Field-TextInput {
    flex: 1;
  }
`

export const StyledVesselContainer = styled(StyledTargetDetailsContainer)`
  flex-direction: column;
  align-self: stretch;
`

export const StyledEmptyTarget = styled.div`
  height: 180px;
  background-color: ${p => p.theme.color.cultured};
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    color: ${p => p.theme.color.lightGray};
    font-style: italic;
  }
`

export const StyledVesselForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;

  > .Field-TextInput,
  .Field-NumberInput {
    flex: 1;
  }
`

export const StyledPositionContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`
export const ReportTypeMultiRadio = styled(MultiRadio)`
  > div > div > div:first-child label::after {
    color: ${({ theme }) => theme.color.maximumRed};
    content: ' ●';
  }

  > div > div > div:last-child label::after {
    color: ${({ theme }) => theme.color.blueGray};
    content: ' ●';
  }
`

export const StyledThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`
export const StyledToggle = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`
export const StyledInfractionProven = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`

export const StyledFormikTextInput = styled(FormikTextInput)`
  width: 90px;
`
export const StyledFooter = styled.div<{ $justify?: string | undefined }>`
  background-color: ${p => p.theme.color.charcoal};
  height: 56px;
  color: ${p => p.theme.color.white};
  width: 500px;
  padding: 13px;
  display: flex;
  justify-content: ${p => p.$justify ?? 'space-between'};
  gap: 4px;

  > div {
    display: flex;
  }
`
export const ButtonWithWiteBg = styled(Button)`
  background-color: ${p => p.theme.color.white};
`
export const StyledButton = styled(Button)`
  border: 1px solid ${p => p.theme.color.white};
  padding: 3px 12px;
  margin-right: 8px;
`

export const StyledDeleteButton = styled(IconButton)`
  background-color: ${p => p.theme.color.white};
`

export const FormContainer = styled.div<{
  $context: ReportingContext
  $isRightMenuOpened: boolean
  $position: number
  $reportingFormVisibility?: VisibilityState
}>`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  top: 0;
  right: -500px;
  width: 500px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: ${p => (p.$context === ReportingContext.SIDE_WINDOW ? '6' : '100')};

  ${p => {
    if (p.$context === ReportingContext.MAP) {
      switch (p.$reportingFormVisibility) {
        case VisibilityState.VISIBLE:
          return p.$isRightMenuOpened ? 'right: 56px;' : 'right: 8px;'
        case VisibilityState.REDUCED:
          return `right: 12px; top: calc(100vh - ${p.$position * 52}px);`
        case VisibilityState.NONE:
        default:
          return 'right: -500px;'
      }
    } else {
      switch (p.$reportingFormVisibility) {
        case VisibilityState.VISIBLE:
          return 'right: 0px;'
        case VisibilityState.REDUCED:
          return `right: 0px; top: calc(100vh - ${p.$position * 52}px);`
        case VisibilityState.NONE:
        default:
          return 'right: -500px;'
      }
    }
  }}
`

export const SideWindowBackground = styled.div`
  position: absolute;
  background-color: ${p => p.theme.color.charcoal};
  opacity: 0.6;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 5;
`
