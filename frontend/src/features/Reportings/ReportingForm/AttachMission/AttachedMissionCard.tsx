import { customDayjs as dayjs, pluralize } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { getMissionStatus, type Mission } from '../../../../domain/entities/missions'
import { MissionStatusLabel } from '../../../../ui/MissionStatusLabel'
import { missionTypesToString } from '../../../../utils/missionTypes'
import { StatusActionTag } from '../../components/StatusActionTag'

import type { ControlStatusEnum } from '../../../../domain/entities/reporting'

export function AttachedMissionCard({
  attachedMission,
  controlStatus
}: {
  attachedMission: Mission | undefined
  controlStatus: ControlStatusEnum
}) {
  if (!attachedMission) {
    return null
  }

  const { controlUnits, endDateTimeUtc, missionTypes, startDateTimeUtc } = attachedMission || {}

  const firstControlUnit = controlUnits[0]
  const missionStatus = getMissionStatus(attachedMission)

  const startDate = dayjs(startDateTimeUtc)
  const endDate = dayjs(endDateTimeUtc)

  const isMissionDuringOneDay = !endDateTimeUtc || (endDateTimeUtc && endDate.diff(startDate, 'day') === 0)

  const formattedStartDate = startDate.isValid() && startDate.format('D MMM YYYY')
  const formattedEndDate = endDateTimeUtc && endDate.isValid() && endDate.format('D MMM YYYY')
  const missionDurationText = isMissionDuringOneDay
    ? formattedStartDate
    : `du ${formattedStartDate} au ${formattedEndDate}`

  return (
    <Wrapper data-cy="attach-mission-to-reporting-overlay">
      <Header>
        <Title>
          {controlUnits && controlUnits?.length === 1 && (
            <>
              <div>{firstControlUnit?.name.toUpperCase()}</div>
              {firstControlUnit?.contact ? (
                <div>{firstControlUnit?.contact}</div>
              ) : (
                <NoContact>Aucun contact renseigné</NoContact>
              )}
            </>
          )}
          {controlUnits?.length > 1 && firstControlUnit && (
            <>
              <div>{firstControlUnit?.name.toUpperCase()}</div>
              <MultipleControlUnits>
                et {controlUnits.length - 1} {pluralize('autre', controlUnits.length - 1)}{' '}
                {pluralize('unité', controlUnits.length - 1)}
              </MultipleControlUnits>
            </>
          )}
        </Title>
      </Header>

      <Body>
        <Details>
          <div>
            Mission {missionTypesToString(missionTypes)} – {missionDurationText}
          </div>
          <MissionStatusLabel missionStatus={missionStatus} />
        </Details>
        <div>
          <StatusActionTag controlStatus={controlStatus} />
        </div>
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
const Details = styled.div`
  color: ${p => p.theme.color.slateGray};
  display: flex;
  flex: 2;
  flex-direction: column;
`

const Title = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  color: ${p => p.theme.color.gunMetal};
`

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`
