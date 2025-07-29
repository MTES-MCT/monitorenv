import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AccountState = {
  isSuperUser: boolean | undefined
}

const INITIAL_STATE: AccountState = {
  isSuperUser: false
}
const accountSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'account',
  reducers: {
    setIsSuperUser(state, action: PayloadAction<boolean | undefined>) {
      state.isSuperUser = action.payload
    }
  }
})
export const accountActions = accountSlice.actions

export const accountSliceReducer = accountSlice.reducer
