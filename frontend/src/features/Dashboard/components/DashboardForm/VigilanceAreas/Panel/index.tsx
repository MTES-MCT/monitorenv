import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { PanelComments } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelComments'
import { PanelImages } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelImages'
import { PanelLinks } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelLinks'
import { PanelPeriodAndThemes } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelPeriodAndThemes'
import { PanelSource } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelSource'
import {
  Header,
  PanelBody,
  PanelContainer,
  SubHeaderContainer,
  Title,
  TitleContainer
} from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, Tag, THEME } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { useEffect } from 'react'
import styled from 'styled-components'

import { RegulatoryAreas } from './RegulatoryAreas'

export function Panel({ className, dashboardId }: { className: string; dashboardId: number }) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.openPanel)

  const { data: vigilanceArea } = useGetVigilanceAreaQuery(
    openPanel?.id && openPanel.type === Dashboard.Block.VIGILANCE_AREAS ? openPanel?.id : skipToken
  )

  const onCloseIconClicked = () => {
    dispatch(dashboardActions.setDashboardPanel())
  }

  useEffect(
    () => () => {
      dispatch(dashboardActions.setDashboardPanel())
    },
    [dispatch]
  )

  if (!openPanel || openPanel.type !== Dashboard.Block.VIGILANCE_AREAS) {
    return null
  }

  return (
    <>
      <Wrapper $isOpen={!!openPanel} className={className}>
        <Header $isEditing>
          <TitleContainer>
            <LayerLegend
              isArchived={vigilanceArea?.isArchived}
              layerType={MonitorEnvLayers.VIGILANCE_AREA}
              legendKey={vigilanceArea?.comments ?? 'aucun nom'}
              size={Size.NORMAL}
              type={vigilanceArea?.name ?? 'aucun nom'}
            />
            <Title $isDraft={vigilanceArea?.isDraft ?? true} $isFullWidth title={vigilanceArea?.name}>
              {vigilanceArea?.name}
            </Title>
          </TitleContainer>

          <SubHeaderContainer>
            {vigilanceArea?.isDraft && (
              <Tag backgroundColor={THEME.color.slateGray} color={THEME.color.white}>
                Brouillon
              </Tag>
            )}
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.Close}
              onClick={onCloseIconClicked}
              size={Size.SMALL}
              title="Fermer la zone de vigilance"
            />
          </SubHeaderContainer>
        </Header>
        <PanelContainer className={className}>
          <PanelBody>
            <PanelPeriodAndThemes vigilanceArea={vigilanceArea} />

            <PanelComments comments={vigilanceArea?.comments} />

            {vigilanceArea?.linkedRegulatoryAreas && vigilanceArea?.linkedRegulatoryAreas.length > 0 && (
              <RegulatoryAreas regulatoryAreaIds={vigilanceArea?.linkedRegulatoryAreas} />
            )}
            {/* TODO : add AMP when the block is added */}
            {/* {vigilanceArea?.linkedAMPs && vigilanceArea?.linkedAMPs.length > 0 && (
            <PanelSubPart>
              <PanelInlineItemLabel>AMP en lien</PanelInlineItemLabel>
              <AMPList isReadOnly linkedAMPs={vigilanceArea?.linkedAMPs} />
            </PanelSubPart>
          )} */}
            {vigilanceArea?.images && vigilanceArea?.images.length > 0 && (
              <PanelImages images={vigilanceArea?.images} isSideWindow vigilanceAreaName={vigilanceArea?.name} />
            )}

            {vigilanceArea?.links && vigilanceArea?.links.length > 0 && <PanelLinks links={vigilanceArea.links} />}
            <PanelSource createdBy={vigilanceArea?.createdBy} source={vigilanceArea?.source} />
          </PanelBody>
        </PanelContainer>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div<{ $isOpen: boolean }>`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 5px #70778540;
  position: absolute;
  width: 400px;
  z-index: 1;
`
