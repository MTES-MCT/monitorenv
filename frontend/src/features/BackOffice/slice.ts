import { createSlice } from '@reduxjs/toolkit'

interface BackOfficeState {}
const INITIAL_STATE: BackOfficeState = {}

const backOfficeSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOffice',
  reducers: {}
})

export const backOfficeActions = backOfficeSlice.actions
export const backOfficeReducer = backOfficeSlice.reducer
