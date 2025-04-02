import { ControlCard } from '@features/commonComponents/ControlCard'
import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { updateSelectedControlId } from '@features/RecentActivity/useCases/updateSelectedControlId'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'

import type { Feature } from 'ol'

export function RecentActivityControlCard({ control, isSelected = false }: { control: Feature; isSelected?: boolean }) {
  const dispatch = useAppDispatch()

  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, id, infractions, missionId, themeIds } =
    control.getProperties()

  const { themes } = useGetControlPlans()
  const controlThemes = themeIds?.map(themeId => themes[themeId]?.theme).join(',')

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
