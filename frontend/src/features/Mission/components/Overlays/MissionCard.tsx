import { Bold } from '@components/style'
import { CompletionStatusTag } from '@features/Mission/components/CompletionStatusTag'
import { MissionStatusTag } from '@features/Mission/components/MissionStatusTag'
import { missionActions } from '@features/Mission/slice'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { getMissionCompletionStatus, humanizeMissionTypes } from '@features/Mission/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, IconButton, Size, customDayjs as dayjs, pluralize } from '@mtes-mct/monitor-ui'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

type MissionCardProps = {
  feature: any
  isOnlyHoverable?: boolean
  selected?: boolean
  updateMargins?: (margin: number) => void
}
export function MissionCard({ feature, isOnlyHoverable = false, selected = false, updateMargins }: MissionCardProps) {
  const dispatch = useAppDispatch()
  const displayMissionsLayer = useAppSelector(state => state.global.displayMissionsLayer)
  const listener = useAppSelector(state => state.draw.listener)
  const isReportingAttachmentInProgress = useAppSelector(
    state => state.attachReportingToMission.isReportingAttachmentInProgress
  )

  const {
    controlUnits,
    endDateTimeUtc,
    envActions,
    fishActions,
    missionId,
    missionStatus,
    missionTypes,
    numberOfControls,
    numberOfSurveillance,
    startDateTimeUtc
  } = feature.getProperties()

  const ref = useRef<HTMLDivElement>(null)

  const startDate = dayjs(startDateTimeUtc)
  const endDate = dayjs(endDateTimeUtc)

  const isMissionDuringOneDay = !endDateTimeUtc || (endDateTimeUtc && endDate.diff(startDate, 'day') === 0)

  const formattedStartDate = startDate.isValid() && startDate.format('D MMM YYYY')
  const formattedEndDate = endDateTimeUtc && endDate.isValid() && endDate.format('D MMM YYYY')
  const missionDurationText = isMissionDuringOneDay
    ? formattedStartDate
    : `du ${formattedStartDate} au ${formattedEndDate}`

  const missionCompletion = getMissionCompletionStatus(feature.getProperties())

  const handleEditMission = useCallback(() => {
    dispatch(editMissionInLocalStore(missionId, 'map'))
    dispatch(closeAllOverlays())
  }, [dispatch, missionId])

  const handleCloseOverlay = useCallback(() => {
    dispatch(missionActions.resetSelectedMissionIdOnMap())
    dispatch(removeOverlayStroke())
  }, [dispatch])

  useEffect(() => {
    if (feature && ref.current && updateMargins) {
      const cardHeight = ref.current.offsetHeight
      updateMargins(cardHeight === 0 ? 200 : cardHeight)
    }
  }, [feature, updateMargins])

  const actionsText = useMemo(() => {
    if (envActions.length > 0) {
      return (
        <MultipleControlUnits>
          Actions <Bold>CACEM</Bold>{' '}
          {fishActions.length > 0 && (
            <>
              et <Bold>CNSP</Bold>
            </>
          )}
        </MultipleControlUnits>
      )
    }

    if (envActions.length === 0 && fishActions.length > 0) {
      return (
        <MultipleControlUnits>
          Actions <Bold>CNSP</Bold>
        </MultipleControlUnits>
      )
    }

    return null
  }, [envActions, fishActions])

  if (!displayMissionsLayer || listener || isReportingAttachmentInProgress) {
    return null
  }

  return (
    <Wrapper ref={ref} data-cy="mission-overlay">
      <Header>
        <Title>
          {controlUnits?.length === 1 && (
            <>
              <div>{controlUnits[0].name?.toUpperCase()}</div>
              {controlUnits[0].contact ? (
                <div>{controlUnits[0].contact}</div>
              ) : (
                <NoContact>Aucun contact renseigné</NoContact>
              )}
            </>
          )}
          {controlUnits?.length > 1 && controlUnits[0] && (
            <>
              <div>{controlUnits[0].name?.toUpperCase()}</div>
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

      <TagsContainer>
        <MissionStatusTag status={missionStatus} />
        <CompletionStatusTag completion={missionCompletion} />
      </TagsContainer>

      <Details>
        <div>
          {' '}
          Mission {humanizeMissionTypes(missionTypes)} – {missionDurationText}
        </div>
        <div>
          {numberOfControls} {pluralize('contrôle', numberOfControls)} et {numberOfSurveillance}{' '}
          {pluralize('surveillance', numberOfSurveillance)}
        </div>
        {actionsText}
      </Details>

      {!isOnlyHoverable && (
        <EditButton
          accent={Accent.PRIMARY}
          disabled={!selected}
          Icon={Icon.Edit}
          onClick={handleEditMission}
          size={Size.SMALL}
        >
          Éditer la mission
        </EditButton>
      )}
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

const TagsContainer = styled.div`
  display: inline-flex;
  gap: 8px;
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
