import { ControlCard } from '@features/commonComponents/ControlCard'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { extractThemesAsText } from '@utils/extractThemesAsText'

import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { Feature } from 'ol'

export function MissionControlCard({ feature }: { feature: Feature }) {
  const listener = useAppSelector(state => state.draw.listener)
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, controlPlans, infractions } =
    feature.getProperties()

  const { isLoading, themes } = useGetControlPlans()

  const controlThemes = extractThemesAsText(controlPlans, themes) ?? ''

  if (listener || isLoading) {
    return null
  }

  return (
    <ControlCard
      actionNumberOfControls={actionNumberOfControls}
      actionStartDateTimeUtc={actionStartDateTimeUtc}
      actionTargetType={actionTargetType}
      controlThemes={controlThemes}
      infractions={infractions}
    />
  )
}
