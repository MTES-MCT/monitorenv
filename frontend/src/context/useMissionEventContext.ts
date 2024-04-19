import { useContext } from 'react'

import { MissionEventContext } from './MissionEventContext'

export const useMissionEventContext = () => {
  const onboardingContext = useContext(MissionEventContext)
  if (onboardingContext === undefined) {
    throw new Error('useOnboardingContext must be inside a MissionEventContext')
  }

  return onboardingContext
}
