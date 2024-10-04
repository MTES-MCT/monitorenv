import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import {
  Accent,
  getLocalizedDayjs,
  Icon,
  IconButton,
  OPENLAYERS_PROJECTION,
  THEME,
  useClickOutsideEffect,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { ReportingTypeEnum, type Reporting } from 'domain/entities/reporting'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { GeoJSON } from 'ol/format'
import { useRef } from 'react'
import styled from 'styled-components'

type ReportingLayerProps = {
  dashboardId: number
  isSelected?: boolean
  reporting: Reporting
}

export function Layer({ dashboardId, isSelected = false, reporting }: ReportingLayerProps) {
  const dispatch = useAppDispatch()

  const selectedReportings = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.REPORTINGS]
  )

  const isPinned = selectedReportings?.includes(reporting)

  const { subThemes, themes } = useGetControlPlans()

  const ref = useRef<HTMLDivElement>(null)
  const { newWindowContainerRef } = useNewWindow()
  useClickOutsideEffect(
    ref,
    () => {
      dispatch(dashboardActions.setSelectedReporting(undefined))
    },
    newWindowContainerRef.current
  )

  const handleSelect = e => {
    e.stopPropagation()

    if (isPinned) {
      dispatch(dashboardActions.removeReporting(reporting))
      dispatch(dashboardActions.setSelectedReporting(undefined))
    } else {
      dispatch(dashboardActions.addReporting(reporting))

      focus(e)
    }
  }

  const focus = e => {
    e.stopPropagation()
    dispatch(dashboardActions.setSelectedReporting(reporting))

    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(reporting.geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  const remove = e => {
    e.stopPropagation()

    dispatch(dashboardActions.removeReporting(reporting))
  }

  return (
    <StyledReporting ref={ref} $isSelected={isSelected} onClick={e => focus(e)}>
      <Header>
        <Icon.Report
          color={
            reporting.reportType === ReportingTypeEnum.INFRACTION_SUSPICION
              ? THEME.color.maximumRed
              : THEME.color.blueGray
          }
        />
        <Name>
          Signalement {reporting.reportingId} -{' '}
          {reporting.reportingSources.map(source => source.displayedSource).join(', ')}
        </Name>

        {isSelected ? (
          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.charcoal}
            Icon={Icon.Close}
            onClick={remove}
            title="Supprimer le signalement"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            color={isPinned ? THEME.color.blueGray : THEME.color.charcoal}
            Icon={isPinned ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelect}
            title="Sélectionner le signalement"
          />
        )}
      </Header>
      {reporting.createdAt && <Date>{getLocalizedDayjs(reporting.createdAt).format('DD MMM YYYY à HH:mm')} (UTC)</Date>}
      <Content>
        {reporting.themeId && (
          <Theme>
            {themes[reporting.themeId]?.theme} /{' '}
            {reporting.subThemeIds.map(subThemeid => subThemes[subThemeid]?.subTheme).join(', ')} -{' '}
          </Theme>
        )}
        <Description>{reporting.description}</Description>
      </Content>
    </StyledReporting>
  )
}

const StyledReporting = styled.div<{ $isSelected: boolean }>`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;

  padding: 16px 24px;

  :hover {
    background: ${p => p.theme.color.blueYonder25};
    cursor: pointer;
  }

  border-top: 1px solid ${p => p.theme.color.lightGray};

  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
        margin-left: 4px;
        margin-right: 4px;
    `}
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  margin: 0 auto 0 11px;
`

const Date = styled.span`
  margin-left: 31px;
  color: ${p => p.theme.color.slateGray};
`

const Theme = styled.span`
  color: ${p => p.theme.color.charcoal};
  font-weight: bold;
`

const Description = styled.span`
  color: ${p => p.theme.color.charcoal};
`

const Content = styled.div`
  margin-left: 31px;
  margin-top: 8px;
`
