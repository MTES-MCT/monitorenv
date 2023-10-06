import { Icon, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { getFormattedReportingId } from '../../../../domain/entities/reporting'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function ReportingCard({ feature, updateMargins }: { feature: any; updateMargins: (margin: number) => void }) {
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)

  const ref = useRef<HTMLDivElement>(null)

  const { createdAt, description, displayedSource, isArchived, reportingId, subThemes, theme, validityTime } =
    feature.getProperties()

  const creationDate = getLocalizedDayjs(createdAt).format('DD MMM YYYY à HH:mm')
  const endOfValidity = getLocalizedDayjs(createdAt).add(validityTime || 0, 'hour')
  const timeLeft = customDayjs(endOfValidity).diff(getLocalizedDayjs(customDayjs().toISOString()), 'hour', true)

  const subThemesFormatted = subThemes?.map(subTheme => subTheme).join(', ')

  const timeLeftText = useMemo(() => {
    if (timeLeft < 0 || isArchived) {
      return 'Archivé'
    }

    if (timeLeft > 0 && timeLeft < 1) {
      return 'Fin dans < 1h'
    }

    return `Fin dans ${Math.round(timeLeft)} h`
  }, [timeLeft, isArchived])

  useEffect(() => {
    if (feature && ref.current) {
      const cardHeight = ref.current.offsetHeight
      updateMargins(cardHeight === 0 ? 200 : cardHeight)
    }
  }, [feature, updateMargins])

  if (!attachReportingListener) {
    return null
  }

  return (
    <Wrapper ref={ref} data-cy="reporting-overlay">
      <StyledHeader>
        <StyledHeaderFirstLine>
          <StyledBoldText>{`SIGNALEMENT ${getFormattedReportingId(reportingId)}`}</StyledBoldText>
          <StyledBoldText>{displayedSource}</StyledBoldText>
          <StyledGrayText>{creationDate} (UTC)</StyledGrayText>
        </StyledHeaderFirstLine>

        <StyledHeaderSecondLine>
          {timeLeft > 0 && !isArchived && (
            <>
              <Icon.Clock />
              <span>{timeLeftText}</span>
            </>
          )}
        </StyledHeaderSecondLine>
      </StyledHeader>

      <div>
        <StyledThemeContainer>
          {theme && <StyledBoldText>{theme}</StyledBoldText>}
          {subThemes?.length > 0 && <StyledMediumText>&nbsp;/&nbsp;{subThemesFormatted}</StyledMediumText>}
        </StyledThemeContainer>
        {description && <StyledDescription title={description}>{description}</StyledDescription>}
      </div>
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
  gap: 16px;
  flex: 0 0 345px;
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
  > span {
    max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const StyledHeaderSecondLine = styled.div`
  display: flex;
  flex-direction: row;
  > span {
    margin-left: 4px;
    color: ${p => p.theme.color.charcoal};
  }
`

const StyledBoldText = styled.span`
  font-weight: 700;
  color: ${p => p.theme.color.gunMetal};
`
const StyledMediumText = styled.span`
  font-weight: 500;
  color: ${p => p.theme.color.gunMetal};
`
const StyledGrayText = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: flex;
  align-items: baseline;
`

const StyledDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${p => p.theme.color.gunMetal};
  padding-right: 32px;
`

const StyledThemeContainer = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding-right: 32px;
`
