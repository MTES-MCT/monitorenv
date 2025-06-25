import { homeStore } from '@store/index'

import { createUserErrorFactory } from './CreateUserErrorFactory'

export const newUserError = createUserErrorFactory(homeStore.dispatch)
