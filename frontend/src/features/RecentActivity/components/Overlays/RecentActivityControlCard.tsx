import { ControlCard } from '@features/commonComponents/ControlCard'
import { updateSelectedControlId } from '@features/RecentActivity/useCases/updateSelectedControlId'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetControlPlans } from '@hooks/useGetControlPlans'

import type { Feature } from 'ol'

export function RecentActivityControlCard({ control, isSelected = false }: { control: Feature; isSelected?: boolean }) {
  const dispatch = useAppDispatch()

  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themeIds } =
    control.getProperties()

  const { themes } = useGetControlPlans()
  const controlThemes = themeIds?.map(themeId => themes[themeId]?.theme).join(',')

  const closeControl = () => {
    if (isSelected) {
      dispatch(updateSelectedControlId())
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
