import { CompletionStatusTag } from '@features/Mission/components/CompletionStatusTag'
import { MissionStatusTag } from '@features/Mission/components/MissionStatusTag'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { getMissionCompletionStatus, humanizeMissionTypes } from '@features/Mission/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { customDayjs as dayjs, pluralize } from '@mtes-mct/monitor-ui'
import { getMissionStatus, type Mission } from 'domain/entities/missions'
import styled from 'styled-components'

import { StatusActionTag } from '../../StatusActionTag'

import type { ControlStatusEnum } from 'domain/entities/reporting'

export function AttachedMissionCard({
  attachedMission,
  controlStatus
}: {
  attachedMission: Mission | undefined
  controlStatus: ControlStatusEnum
}) {
  const dispatch = useAppDispatch()
  if (!attachedMission) {
    return null
  }
  const missionCompletion = getMissionCompletionStatus(attachedMission)

  const { controlUnits, endDateTimeUtc, missionTypes, startDateTimeUtc } = attachedMission || {}

  const firstControlUnit = controlUnits[0]
  const missionStatus = getMissionStatus(attachedMission)

  const startDate = dayjs(startDateTimeUtc)
  const endDate = dayjs(endDateTimeUtc)

  const isMissionDuringOneDay = !endDateTimeUtc || (endDateTimeUtc && endDate.diff(startDate, 'day') === 0)

  const formattedStartDate = startDate.isValid() && startDate.format('DD/MM/YYYY')
  const formattedEndDate = endDateTimeUtc && endDate.isValid() && endDate.format('DD/MM/YYYY')
  const missionDurationText = isMissionDuringOneDay
    ? formattedStartDate
    : `du ${formattedStartDate} au ${formattedEndDate}`

  const goToMission = () => {
    dispatch(editMissionInLocalStore(attachedMission?.id, 'sideWindow'))
  }

  return (
    <Wrapper data-cy="attach-mission-to-reporting-overlay" onClick={goToMission}>
      <Header>
        <Title>
          {controlUnits && controlUnits?.length === 1 && (
            <>
              <TitleWithActionTag>
                <ControlUnitTitle>{firstControlUnit?.name.toUpperCase()}</ControlUnitTitle>
                <StatusActionTag controlStatus={controlStatus} />
              </TitleWithActionTag>
              {firstControlUnit?.contact ? (
                <div>{firstControlUnit?.contact}</div>
              ) : (
                <NoContact>Aucun contact renseigné</NoContact>
              )}
            </>
          )}
          {controlUnits?.length > 1 && firstControlUnit && (
            <>
              <TitleWithActionTag>
                <ControlUnitTitle>{firstControlUnit?.name.toUpperCase()}</ControlUnitTitle>
                <StatusActionTag controlStatus={controlStatus} />
              </TitleWithActionTag>
              <MultipleControlUnits>
                et {controlUnits.length - 1} {pluralize('autre', controlUnits.length - 1)}{' '}
                {pluralize('unité', controlUnits.length - 1)}
              </MultipleControlUnits>
            </>
          )}
        </Title>
      </Header>

      <Body>
        <div>
          Mission {humanizeMissionTypes(missionTypes)} – {missionDurationText}
        </div>
        <TagsContainer>
          <MissionStatusTag status={missionStatus} />
          <CompletionStatusTag completion={missionCompletion} />
        </TagsContainer>
      </Body>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778529;
  background-color: ${p => p.theme.color.cultured};
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`
const MultipleControlUnits = styled.div`
  color: ${p => p.theme.color.slateGray};
`
const NoContact = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-weight: 400;
  font-style: italic;
`
const Title = styled.div`
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  flex: 1;
  flex-direction: column;
  font: normal normal bold 13px/18px Marianne;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const TitleWithActionTag = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`

const ControlUnitTitle = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TagsContainer = styled.div`
  display: inline-flex;
  gap: 8px;
`
