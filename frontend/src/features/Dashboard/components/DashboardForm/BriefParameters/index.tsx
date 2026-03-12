import { Tooltip } from '@components/Tooltip'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { getOptionsFromLabelledEnum, MultiRadio } from '@mtes-mct/monitor-ui'
import { forwardRef } from 'react'
import styled from 'styled-components'
import { Axis, AxisLabel } from 'types'

import { Accordion, Title } from '../Accordion'

import type { BaseLayer } from 'domain/entities/layers/BaseLayer'

type BriefParametersProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const BriefParameters = forwardRef<HTMLDivElement, BriefParametersProps>(
  ({ isExpanded, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
    const backgroundMap = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards[activeDashboardId]?.backgroundMap : undefined
    )
    const axis = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards[activeDashboardId]?.axis : undefined
    )

    const baseLayersKeys = getOptionsFromLabelledEnum(Dashboard.BackgroundMapLabel)
    const axisKeys = getOptionsFromLabelledEnum(AxisLabel)

    const handleBackgroundMap = (layercode: BaseLayer | undefined) => {
      if (layercode) {
        dispatch(dashboardActions.setBackgroundMap(layercode))
      }
    }

    const handleZoneOrder = (order: Axis | undefined) => {
      if (order) {
        dispatch(dashboardActions.setAxis(order))
      }
    }

    const titleWithTooltip = (
      <TitleContainer>
        <Title>Paramètres des zones sélectionnées</Title>
        <Tooltip isSideWindow>Ces paramètres impactent uniquement le PDF</Tooltip>
      </TitleContainer>
    )

    return (
      <Accordion
        isExpanded={isExpanded}
        name="Paramètres des zones sélectionnées"
        setExpandedAccordion={setExpandedAccordion}
        title={titleWithTooltip}
        titleRef={ref}
      >
        <Container>
          <MultiRadio
            label="Fonds de carte"
            name="backgroundMap"
            onChange={handleBackgroundMap}
            options={baseLayersKeys}
            value={backgroundMap}
          />
          <MultiRadio
            label="Ordonnancement des zones"
            name="zonesOrder"
            onChange={handleZoneOrder}
            options={axisKeys}
            value={axis}
          />
        </Container>
      </Accordion>
    )
  }
)

const Container = styled.div`
  display: flex;
  gap: 15%;
  padding: 20px 24px;
`

const TitleContainer = styled.div`
  display: flex;
  gap: 8px;
`
