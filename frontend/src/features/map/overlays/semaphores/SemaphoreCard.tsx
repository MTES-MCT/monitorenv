import { Accent, Button, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tooltip, Whisper } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import {
  setDisplayedItems,
  setOverlayCoordinates,
  setReportingFormVisibility
} from '../../../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { resetSelectedSemaphore } from '../../../../domain/shared_slices/SemaphoresSlice'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { OverlayTriggerType } from 'rsuite/esm/Overlay/OverlayTrigger'

const PHONE_TOOLTIP_STATE = {
  click: {
    className: 'greenTooltip',
    text: 'Numéro copié',
    trigger: 'click'
  },
  hover: {
    className: 'blueTooltip',
    text: 'Copier le numéro',
    trigger: 'hover'
  }
}

const MAIL_TOOLTIP_STATE = {
  click: {
    className: 'greenTooltip',
    text: 'Mail copié',
    trigger: 'click'
  },
  hover: {
    className: 'blueTooltip',
    text: 'Copier le mail',
    trigger: 'hover'
  }
}
const hoverTooltip = (text, className) => <StyledTooltip className={className}>{text}</StyledTooltip>

export function SemaphoreCard({ feature, selected = false }: { feature: any; selected?: boolean }) {
  const dispatch = useDispatch()
  const {
    global: { displaySemaphoresLayer },
    reportingState: { isDirty }
  } = useAppSelector(state => state)

  const { email, name, phoneNumber, unit } = feature.getProperties()
  const [tooltipPhoneState, setTooltipPhoneState] = useState(PHONE_TOOLTIP_STATE.hover)

  const [tooltipMailState, setTooltipMailState] = useState(MAIL_TOOLTIP_STATE.hover)

  const handleCloseOverlay = useCallback(() => {
    dispatch(resetSelectedSemaphore())
    dispatch(setOverlayCoordinates(undefined))
  }, [dispatch])

  // TODO refacto to clean state when one tooltip was click and the other is hover
  const onCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber)
    setTooltipPhoneState(PHONE_TOOLTIP_STATE.click)
    setTooltipMailState(MAIL_TOOLTIP_STATE.hover)
  }

  const onCopyMail = () => {
    navigator.clipboard.writeText(email)
    setTooltipMailState(MAIL_TOOLTIP_STATE.click)
    setTooltipPhoneState(PHONE_TOOLTIP_STATE.hover)
  }

  const addReporting = () => {
    if (isDirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
    } else {
      dispatch(
        setDisplayedItems({ isSearchSemaphoreVisible: false, mapToolOpened: undefined, missionsMenuIsOpen: false })
      )
      dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
      // dispatch(reportingStateActions.setReportingState({ id: undefined, semaphoreId: id, sourceType: 'SEMAPHORE' }))
    }
  }

  if (!displaySemaphoresLayer) {
    return null
  }

  return (
    <Wrapper data-cy="semaphore-overlay">
      <StyledHeader>
        <StyledTitle>{unit ?? name.toLowerCase()}</StyledTitle>
        <CloseButton
          $isVisible={selected}
          accent={Accent.TERTIARY}
          data-cy="semaphore-overlay-close"
          Icon={Icon.Close}
          iconSize={14}
          onClick={handleCloseOverlay}
        />
      </StyledHeader>

      <StyledContactContainer>
        {phoneNumber && (
          <StyledContactLine>
            <Whisper
              controlId="phone-tooltip"
              onClick={onCopyPhone}
              placement="left"
              speaker={hoverTooltip(tooltipPhoneState.text, tooltipPhoneState.className)}
              trigger={tooltipPhoneState.trigger as OverlayTriggerType}
            >
              <span>
                <StyledCopyButton
                  accent={Accent.TERTIARY}
                  color={COLORS.slateGray}
                  Icon={Icon.Duplicate}
                  iconSize={20}
                />
              </span>
            </Whisper>
            <span>Contact&nbsp;:&nbsp;{phoneNumber}</span>
          </StyledContactLine>
        )}
        {email && (
          <StyledContactLine>
            <Whisper
              controlId="mail-tooltip"
              onClick={onCopyMail}
              placement="left"
              speaker={hoverTooltip(tooltipMailState.text, tooltipMailState.className)}
              trigger={tooltipMailState.trigger as OverlayTriggerType}
            >
              <span>
                <StyledCopyButton
                  accent={Accent.TERTIARY}
                  color={COLORS.slateGray}
                  Icon={Icon.Duplicate}
                  iconSize={20}
                />
              </span>
            </Whisper>
            <span>{email}</span>
          </StyledContactLine>
        )}

        <StyledButton Icon={Icon.Plus} isFullWidth onClick={addReporting}>
          Créer un signalement
        </StyledButton>
      </StyledContactContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778540;
  border-radius: 1px;
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`

const StyledTitle = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  color: ${p => p.theme.color.gunMetal};
`
const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 5px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const StyledContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  font: normal normal normal 13px/18px Marianne;
  color: ${p => p.theme.color.slateGray};
  white-space: nowrap;
`

const StyledContactLine = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`
const StyledCopyButton = styled(IconButton)`
  padding: 0px;
  .Element-IconBox {
    :hover {
      color: ${p => p.theme.color.blueYonder[100]};
    }
  }
`

const StyledTooltip = styled(Tooltip)`
  background-color: ${p => p.theme.color.blueYonder[100]};
  height: 32px;
  padding: 2px 16px;
  line-height: 2;
  border-radius: 0px;

  &.greenTooltip {
    background-color: ${p => p.theme.color.mediumSeaGreen};
  }

  &.rs-tooltip.placement-left:after {
    border-left-color: ${p => p.theme.color.blueYonder[100]};
  }
  &.greenTooltip.rs-tooltip.placement-left:after {
    border-left-color: ${p => p.theme.color.mediumSeaGreen};
  }
`
// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
  margin-top: 16px;
`
