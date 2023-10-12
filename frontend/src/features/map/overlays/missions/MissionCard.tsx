import { Accent, Button, Icon, IconButton, Size, customDayjs as dayjs, pluralize } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { editMissionInLocalStore } from '../../../../domain/use_cases/missions/editMissionInLocalStore'
import { clearSelectedMissionOnMap } from '../../../../domain/use_cases/missions/selectMissionOnMap'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { MissionSourceTag } from '../../../../ui/MissionSourceTag'
import { MissionStatusLabel } from '../../../../ui/MissionStatusLabel'
import { missionTypesToString } from '../../../../utils/missionTypes'

export function MissionCard({ feature, selected = false }: { feature: any; selected?: boolean }) {
  const dispatch = useAppDispatch()
  const {
    controlUnits,
    endDateTimeUtc,
    missionId,
    missionSource,
    missionStatus,
    missionTypes,
    numberOfControls,
    numberOfSurveillance,
    startDateTimeUtc
  } = feature.getProperties()

  const startDate = dayjs(startDateTimeUtc)
  const endDate = dayjs(endDateTimeUtc)

  const isMissionDuringOneDay = !endDateTimeUtc || (endDateTimeUtc && endDate.diff(startDate, 'day') === 0)

  const formattedStartDate = startDate.isValid() && startDate.format('D MMM YYYY')
  const formattedEndDate = endDateTimeUtc && endDate.isValid() && endDate.format('D MMM YYYY')
  const missionDurationText = isMissionDuringOneDay
    ? formattedStartDate
    : `du ${formattedStartDate} au ${formattedEndDate}`

  const handleEditMission = useCallback(() => {
    dispatch(editMissionInLocalStore(missionId))
  }, [dispatch, missionId])

  const handleCloseOverlay = useCallback(() => {
    dispatch(clearSelectedMissionOnMap())
  }, [dispatch])

  return (
    <Wrapper data-cy="mission-overlay">
      <Header>
        <Title>
          {controlUnits.length === 1 && (
            <>
              <div>{controlUnits[0].name.toUpperCase()}</div>
              {controlUnits[0].contact ? (
                <div>{controlUnits[0].contact}</div>
              ) : (
                <NoContact>Aucun contact renseigné</NoContact>
              )}
            </>
          )}
          {controlUnits.length > 1 && controlUnits[0] && (
            <>
              <div>{controlUnits[0].name.toUpperCase()}</div>
              <MultipleControlUnits>
                et {controlUnits.length - 1} {pluralize('autre', controlUnits.length - 1)}{' '}
                {pluralize('unité', controlUnits.length - 1)}
              </MultipleControlUnits>
            </>
          )}
        </Title>

        <CloseButton
          $isVisible={selected}
          accent={Accent.TERTIARY}
          data-cy="mission-overlay-close"
          Icon={Icon.Close}
          iconSize={14}
          onClick={handleCloseOverlay}
        />
      </Header>

      <MissionSourceTag source={missionSource} styleProps={{ alignSelf: 'start' }} />
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

      <EditButton
        accent={Accent.PRIMARY}
        disabled={!selected}
        Icon={Icon.Edit}
        onClick={handleEditMission}
        size={Size.SMALL}
      >
        Editer la mission
      </EditButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778540;
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 0 0 260px;
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

const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 5px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const Details = styled.div`
  > div {
    color: ${p => p.theme.color.slateGray};
    white-space: nowrap;
  }
`

const Title = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  color: ${p => p.theme.color.gunMetal};
`

const EditButton = styled(Button)`
  align-self: start;
`
