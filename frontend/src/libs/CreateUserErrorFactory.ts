import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { HomeAppDispatch } from '@store/index'
import type { WindowContext } from 'types'

export type UserError = {
  name: 'UserError'
  userMessage: string
}

/**
 * Crée une fonction `newUserError` contextualisée avec le dispatch Redux.
 */
export function createUserErrorFactory(dispatch: HomeAppDispatch) {
  return function newUserError(userMessage: string, context: WindowContext): UserError {
    let action
    switch (context) {
      case 'map':
        action = addMainWindowBanner({
          children: userMessage,
          closingDelay: 15000,
          isClosable: true,
          isFixed: true,
          level: Level.WARNING,
          withAutomaticClosing: true
        })
        break
      case 'sideWindow':
        action = addSideWindowBanner({
          children: userMessage,
          closingDelay: 15000,
          isClosable: true,
          isFixed: true,
          level: Level.WARNING,
          withAutomaticClosing: true
        })
        break
      case 'backoffice':
        action = addBackOfficeBanner({
          children: userMessage,
          closingDelay: 15000,
          isClosable: true,
          isFixed: true,
          level: Level.WARNING,
          withAutomaticClosing: true
        })
        break
      default:
        throw new Error(`Unknown context: ${context}`)
    }
    dispatch(action)

    return {
      name: 'UserError',
      userMessage
    }
  }
}
