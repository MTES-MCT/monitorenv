import { Accent, Button, Icon, IconButton } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { hideSideButtons, setReportingFormVisibility } from '../../../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { editReportingInLocalStore } from '../../../../domain/use_cases/reportings/editReportingInLocalStore'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function ReportingCard({ feature, selected = false }: { feature: any; selected?: boolean }) {
  const dispatch = useDispatch()
  const {
    global: { displayReportingsLayer },
    reportingState: { isDirty }
  } = useAppSelector(state => state)

  const { createdAt, description, id, sourceName, subThemes, theme, validityTime } = feature.getProperties()

  const creationDate = dayjs(createdAt).format('DD MMM YYYY à HH:mm')

  const endOfValidity = dayjs(createdAt)
    .add(validityTime || 0, 'hour')
    .toISOString()
  const restingTime = dayjs(endOfValidity).diff(dayjs(), 'hour')
  const subThemesFormatted = subThemes.map(subTheme => subTheme).join(', ')

  // TODO gérer le cas sémaphore et unités
  const subTitle = sourceName

  const editReporting = () => {
    if (isDirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
      dispatch(editReportingInLocalStore(id, true))
    } else {
      dispatch(editReportingInLocalStore(id, false))
      dispatch(reportingStateActions.setSelectedReportingId(id))
    }
    dispatch(hideSideButtons())
    dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
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
          <StyledBoldText>{subTitle}</StyledBoldText>
          <StyledCreationDate>{creationDate}</StyledCreationDate>
        </StyledHeaderFirstLine>

        <StyledHeaderSecondLine>
          <Icon.Clock />
          <span>{restingTime < 0 ? 'Archivé' : `Fin dans ${restingTime} h`}</span>

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
  flex: 0 0 320px;
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
