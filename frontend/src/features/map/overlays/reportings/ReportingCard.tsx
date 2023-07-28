import { Accent, Button, Icon, IconButton, customDayjs as dayjs } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { getFormattedReportingId } from '../../../../domain/entities/reporting'
import { reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { openReporting } from '../../../../domain/use_cases/reportings/openReporting'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function ReportingCard({ feature, selected = false }: { feature: any; selected?: boolean }) {
  const dispatch = useDispatch()
  const {
    global: { displayReportingsLayer }
  } = useAppSelector(state => state)

  const { createdAt, description, displayedSource, id, isArchived, reportingId, subThemes, theme, validityTime } =
    feature.getProperties()

  const creationDate = dayjs(createdAt).format('DD MMM YYYY à HH:mm')

  const endOfValidity = dayjs(createdAt).add(validityTime || 0, 'hour')

  const timeLeft = endOfValidity.diff(dayjs(), 'hour')
  const subThemesFormatted = subThemes.map(subTheme => subTheme).join(', ')

  // TODO gérer le cas sémaphore et unités
  const subTitle = displayedSource

  const editReporting = () => {
    dispatch(openReporting(id))
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
          <StyledBoldText>{`SIGNALEMENT ${getFormattedReportingId(reportingId)}`}</StyledBoldText>
          <StyledBoldText>{subTitle}</StyledBoldText>
          <StyledCreationDate>{creationDate}</StyledCreationDate>
        </StyledHeaderFirstLine>

        <StyledHeaderSecondLine>
          <Icon.Clock />
          <span>{timeLeft < 0 || isArchived ? 'Archivé' : `Fin dans ${timeLeft} h`}</span>

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
          {subThemes.length > 0 && <StyledMediumText>&nbsp;/&nbsp;{subThemesFormatted}</StyledMediumText>}
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
  flex: 0 0 345px;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 16px;
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
    color: ${p => p.theme.color.charcoal};
  }
`
const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 4px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const StyledBoldText = styled.span`
  font-weight: 700;
  color: ${p => p.theme.color.gunMetal};
`
const StyledMediumText = styled.span`
  font-weight: 500;
  color: ${p => p.theme.color.gunMetal};
`
const StyledCreationDate = styled.p`
  color: ${p => p.theme.color.slateGray};
`

const StyledDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${p => p.theme.color.gunMetal};
`

const StyledThemeContainer = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 4px;
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
  margin-top: 16px;
  align-self: start;
  width: inherit;
`
