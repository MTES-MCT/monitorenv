import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import styled from 'styled-components'

import { useGetMissionQuery } from '../../../../api/missionsAPI'
import { COLORS } from '../../../../constants/constants'
import { getMissionStatus, getTotalOfControls, getTotalOfSurveillances } from '../../../../domain/entities/missions'
import { MissionStatusLabel } from '../../../../ui/MissionStatusLabel'
import { missionTypesToString } from '../../../../utils/missionTypes'
import { pluralize } from '../../../../utils/pluralize'

export function AttachedMissionCard({ id }: { id: number | undefined }) {
  const { data: attachedMission } = useGetMissionQuery(id || skipToken)

  if (!attachedMission || !id) {
    return null
  }

  const { controlUnits, endDateTimeUtc, missionTypes, startDateTimeUtc } = attachedMission || {}
  const numberOfControls = getTotalOfControls(attachedMission) || 0
  const numberOfSurveillance = getTotalOfSurveillances(attachedMission) || 0

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

      <Details>
        <div>
          {' '}
          Mission {missionTypesToString(missionTypes)} – {missionDurationText}
        </div>
        <div>
          {numberOfControls} {pluralize('contrôle', numberOfControls)} et {numberOfSurveillance}{' '}
          {pluralize('surveillance', numberOfSurveillance)}
        </div>
      </Details>
      <MissionStatusLabel missionStatus={missionStatus} />
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
  color: ${COLORS.slateGray};
`
const NoContact = styled.div`
  color: ${COLORS.slateGray};
  font-weight: 400;
  font-style: italic;
`
const Details = styled.div`
  > div {
    color: ${COLORS.slateGray};
    white-space: nowrap;
  }
`

const Title = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  color: ${COLORS.gunMetal};
`
