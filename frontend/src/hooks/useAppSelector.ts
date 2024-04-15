/* eslint-disable @typescript-eslint/no-restricted-imports */
import { shallowEqual, useSelector } from 'react-redux'

import type { HomeRootState } from '../store'
import type { TypedUseSelectorHook } from 'react-redux'

/**
 * @see https://react-redux.js.org/using-react-redux/usage-with-typescript#typing-the-useselector-hook
 */
export const useAppSelector: TypedUseSelectorHook<HomeRootState> = useSelector

// https://react-redux.js.org/api/hooks#recipe-useshallowequalselector
export const useShallowEqualSelector: TypedUseSelectorHook<HomeRootState> = <T>(
  selector: (state: HomeRootState) => T
): T => useSelector(selector, shallowEqual)
