import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { PanelComments } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelComments'
import { PanelDates } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelDates'
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
import { Accent, Icon, IconButton, Size, Tag, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { type ComponentProps, forwardRef } from 'react'
import styled from 'styled-components'

import { Amps } from './Amps'
import { RegulatoryAreas } from './RegulatoryAreas'

type PanelProps = {
  layerId: number
} & ComponentProps<'div'>

export const Panel = forwardRef<HTMLDivElement, PanelProps>(({ layerId, ...props }, ref) => {
  const dispatch = useAppDispatch()

  const { data: vigilanceArea } = useGetVigilanceAreaQuery(layerId)

  const onCloseIconClicked = () => {
    dispatch(dashboardActions.setDashboardPanel())
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Wrapper ref={ref} {...props}>
      <Header $isEditing>
        <TitleContainer>
          <LayerLegend
            isDisabled={vigilanceArea?.isArchived}
            layerType={MonitorEnvLayers.VIGILANCE_AREA}
            legendKey={vigilanceArea?.comments ?? 'aucun nom'}
            size={Size.NORMAL}
            type={vigilanceArea?.name ?? 'aucun nom'}
          />
          <StyledTitle $isDraft={vigilanceArea?.isDraft ?? true} $isFullWidth title={vigilanceArea?.name}>
            {vigilanceArea?.name}
          </StyledTitle>
        </TitleContainer>

        <SubHeaderContainer>
          {vigilanceArea?.isDraft ? (
            <Tag backgroundColor={THEME.color.slateGray} color={THEME.color.white}>
              Brouillon
            </Tag>
          ) : (
            <Tag backgroundColor={THEME.color.mediumSeaGreen} color={THEME.color.white}>
              Publiée
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
      <PanelContainer>
        <PanelBody>
          <PanelDates vigilanceArea={vigilanceArea} />
          <PanelPeriodAndThemes vigilanceArea={vigilanceArea} />
          <PanelComments comments={vigilanceArea?.comments} />

          {vigilanceArea?.linkedRegulatoryAreas && vigilanceArea?.linkedRegulatoryAreas.length > 0 && (
            <RegulatoryAreas regulatoryAreaIds={vigilanceArea.linkedRegulatoryAreas} />
          )}
          {vigilanceArea?.linkedAMPs && vigilanceArea?.linkedAMPs.length > 0 && (
            <Amps ampIds={vigilanceArea.linkedAMPs} />
          )}
          {vigilanceArea?.images && vigilanceArea?.images.length > 0 && (
            <PanelImages images={vigilanceArea?.images} isSideWindow vigilanceAreaName={vigilanceArea?.name} />
          )}

          {vigilanceArea?.links && vigilanceArea?.links.length > 0 && <PanelLinks links={vigilanceArea.links} />}
          <PanelSource createdBy={vigilanceArea?.createdBy} source={vigilanceArea?.source} />
        </PanelBody>
      </PanelContainer>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 5px #70778540;
  position: absolute;
  width: 400px;
  z-index: 2;
`
const StyledTitle = styled(Title)`
  max-width: 215px;
`
