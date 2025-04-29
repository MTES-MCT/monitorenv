import { useGetThemesQuery } from '@api/themesAPI'
import { ControlCard } from '@features/commonComponents/ControlCard'
import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { updateSelectedControlId } from '@features/RecentActivity/useCases/updateSelectedControlId'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'

import type { Feature } from 'ol'

export function RecentActivityControlCard({ control, isSelected = false }: { control: Feature; isSelected?: boolean }) {
  const dispatch = useAppDispatch()

  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, id, infractions, missionId, themeIds } =
    control.getProperties()

  const { data: themes } = useGetThemesQuery()

  const controlThemes: string = Object.values(themes ?? [])
    .filter(theme => themeIds.includes(theme.id))
    .map(({ name }) => name)
    .join(', ')

  const closeControl = () => {
    if (isSelected) {
      dispatch(updateSelectedControlId())
    }
  }

  const consultMission = async () => {
    await dispatch(editMissionInLocalStore(missionId, 'map'))
    dispatch(missionFormsActions.setActiveActionId(id))
    dispatch(closeAllOverlays())
  }

  return (
    <ControlCard
      actionNumberOfControls={actionNumberOfControls}
      actionStartDateTimeUtc={actionStartDateTimeUtc}
      actionTargetType={actionTargetType}
      controlThemes={controlThemes}
      infractions={infractions}
      isSelected={isSelected}
      onClose={closeControl}
      onConsultMission={consultMission}
    />
  )
}
