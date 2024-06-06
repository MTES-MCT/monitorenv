import { getCurrentUserAuthorization } from 'domain/use_cases/authorization/useGetCurrentUserAuthorization'
import { useEffect, useState } from 'react'

import type { UserAuthorization } from 'domain/entities/authorization/types'

/**
 * Get user authorization
 */
export function useGetUserAuthorization(): UserAuthorization | undefined {
  const [userAuthorization, setUserAuthorization] = useState<UserAuthorization | undefined>(undefined)

  useEffect(() => {
    getCurrentUserAuthorization().then(nextUserAuthorization => {
      setUserAuthorization(nextUserAuthorization)
    })
  }, [])

  return userAuthorization
}
