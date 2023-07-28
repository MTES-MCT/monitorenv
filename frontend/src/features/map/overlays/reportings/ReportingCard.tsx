import { Accent, Button, Icon, IconButton } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { setReportingFormVisibility } from '../../../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function ReportingCard({ feature, selected = false }: { feature: any; selected?: boolean }) {
  const dispatch = useDispatch()
  const { displayReportingsLayer } = useAppSelector(state => state.global)

  const { createdAt, description, id, semaphoreId, subThemes, theme, validityTime } = feature.getProperties()

  const creationDate = dayjs(createdAt).format('DD MMM YYYY à HH:mm')

  const endOfValidity = dayjs(createdAt).add(validityTime || 0, 'hour')
  const restingTime = endOfValidity.diff(dayjs(createdAt), 'hour')
  const subThemesFormatted = subThemes.map(subTheme => subTheme).join(', ')

  const editReporting = () => {
    dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    dispatch(reportingStateActions.setSelectedReportingId(id))
  }

  const closeReportingCard = useCallback(() => {
    dispatch(reportingStateActions.setSelectedReportingIdOnMap(undefined))
  }, [dispatch])

  if (!displayReportingsLayer) {
    return null
  }

  return (
    <Wrapper data-cy="reporting-overlay">
      <StyledHeader>
        <StyledHeaderFirstLine>
          <StyledBoldText>{`SIGNALEMENT ${id} -`}</StyledBoldText>
          <StyledBoldText>{semaphoreId}</StyledBoldText>
          <StyledCreationDate>{creationDate}</StyledCreationDate>
        </StyledHeaderFirstLine>

        <StyledHeaderSecondLine>
          <Icon.Clock />
          <span>{`Fin dans ${restingTime} h`}</span>

          <CloseButton
            $isVisible={selected}
            accent={Accent.TERTIARY}
            data-cy="reporting-overlay-close"
            Icon={Icon.Close}
            iconSize={14}
            onClick={closeReportingCard}
          />
        </StyledHeaderSecondLine>
      </StyledHeader>

      <div>
        <StyledThemeContainer>
          {theme && <StyledBoldText>{theme}</StyledBoldText>}
          {subThemes.length > 0 && <StyledBoldText>&nbsp;/&nbsp;{subThemesFormatted}</StyledBoldText>}
        </StyledThemeContainer>
        {description && <StyledDescription>{description}</StyledDescription>}
      </div>
      <StyledButton Icon={Icon.Edit} isFullWidth onClick={editReporting}>
        Editer le signalement
      </StyledButton>
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
  flex: 0 0 320px;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`

const StyledHeaderFirstLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

const StyledHeaderSecondLine = styled.div`
  display: flex;
  flex-direction: row;
  > span {
    margin-left: 4px;
  }
`
const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 4px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const StyledBoldText = styled.span`
  font: normal normal bold 13px/18px Marianne;
  color: ${p => p.theme.color.gunMetal};
`
const StyledCreationDate = styled.p`
  font-size: 12px;
  color: ${p => p.theme.color.slateGray};
`

const StyledDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const StyledThemeContainer = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font: normal normal normal 13px/18px Marianne;
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
  margin-top: 16px;
  align-self: start;
  width: inherit;
`
