import { Italic } from '@components/style'
import { FishMissionAction } from '@features/Mission/fishActions.types'
import styled from 'styled-components'

import { AirControlCard } from './AirControlCard'
import { AirSurveillanceCard } from './AirSurveillanceCard'
import { LandControlCard } from './LandControlCard'
import { ObservationsCard } from './ObservationsCard'
import { SeaControlCard } from './SeaControlCard'
import { ActionSummaryWrapper, Card, ContentContainer } from '../style'

export function FishActions({ action }) {
  return (
    <Wrapper>
      <Card>
        <ActionSummaryWrapper $type={action.actionType}>
          <ContentContainer>
            {action.actionType === FishMissionAction.MissionActionType.LAND_CONTROL && (
              <LandControlCard action={action} />
            )}
            {action.actionType === FishMissionAction.MissionActionType.AIR_CONTROL && (
              <AirControlCard action={action} />
            )}
            {action.actionType === FishMissionAction.MissionActionType.AIR_SURVEILLANCE && (
              <AirSurveillanceCard action={action} />
            )}
            {action.actionType === FishMissionAction.MissionActionType.OBSERVATION && (
              <ObservationsCard action={action} />
            )}
            {action.actionType === FishMissionAction.MissionActionType.SEA_CONTROL && (
              <SeaControlCard action={action} />
            )}
          </ContentContainer>
        </ActionSummaryWrapper>
      </Card>
      <StyledItalic data-cy="cnsp-action-text">Action CNSP</StyledItalic>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: start;
`
const StyledItalic = styled(Italic)`
  text-align: end;
`
