import { Tooltip } from '@components/Tooltip'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { getOptionsFromLabelledEnum, MultiRadio } from '@mtes-mct/monitor-ui'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { Accordion, Title } from '../Accordion'

import type { BaseLayer } from 'domain/entities/layers/BaseLayer'

type BackgroundMapProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const BackgroundMap = forwardRef<HTMLDivElement, BackgroundMapProps>(
  ({ isExpanded, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
    const backgroundMap = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards[activeDashboardId]?.backgroundMap : undefined
    )

    const baseLayersKeys = getOptionsFromLabelledEnum(Dashboard.BackgroundMapLabel)

    const handleBackgroundMap = (layercode: BaseLayer | undefined) => {
      if (layercode) {
        dispatch(dashboardActions.setBackgroundMap(layercode))
      }
    }

    const titleWithTooltip = (
      <TitleContainer>
        <Title>Fond de carte des zones sélectionnées</Title>
        <Tooltip isSideWindow>
          Les fonds de carte impactés seront ceux de la page récapitulative, des zones réglementaires, des zones de
          vigilance et des zones AMP
        </Tooltip>
      </TitleContainer>
    )

    return (
      <Accordion
        isExpanded={isExpanded}
        name="Fond de carte des zones sélectionnées"
        setExpandedAccordion={setExpandedAccordion}
        title={titleWithTooltip}
        titleRef={ref}
      >
        <Container>
          <MultiRadio
            isLabelHidden
            label="Fonds de carte"
            name="backgroundMap"
            onChange={handleBackgroundMap}
            options={baseLayersKeys}
            value={backgroundMap}
          />
        </Container>
      </Accordion>
    )
  }
)

const Container = styled.div`
  padding: 20px 24px;
`

const TitleContainer = styled.div`
  display: flex;
  gap: 8px;
`
