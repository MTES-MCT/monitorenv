import { UserAccountContext } from 'context/UserAccountContext'
import { useContext } from 'react'

export function useIsSuperUser(): boolean {
  const userAccount = useContext(UserAccountContext)

  return userAccount.isSuperUser
}
