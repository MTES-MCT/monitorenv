import { ControlCard } from '@features/commonComponents/ControlCard'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { removeOverlayStroke } from 'domain/shared_slices/Global'

import type { Feature } from 'ol'

export function RecentActivityControlCard({ control, isSelected = false }: { control: Feature; isSelected?: boolean }) {
  const dispatch = useAppDispatch()

  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themeIds } =
    control.getProperties()

  const { themes } = useGetControlPlans()
  const controlThemes = themeIds?.map(themeId => themes[themeId]?.theme).join(',')

  const closeControl = () => {
    if (isSelected) {
      dispatch(removeOverlayStroke())
      // we need this timeout to delete the overlay stroke before delete the selected control
      setTimeout(() => {
        dispatch(recentActivityActions.setSelectedControlId())
      }, 100)
    }
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
    />
  )
}
