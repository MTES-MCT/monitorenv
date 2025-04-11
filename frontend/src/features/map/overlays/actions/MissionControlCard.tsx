import { ControlCard } from '@features/commonComponents/ControlCard'

import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { Feature } from 'ol'

export function MissionControlCard({ feature }: { feature: Feature }) {
  const listener = useAppSelector(state => state.draw.listener)
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themes } =
    feature.getProperties()

  const controlThemes = themes.map(theme => theme.name).join(' - ')

  if (listener) {
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
